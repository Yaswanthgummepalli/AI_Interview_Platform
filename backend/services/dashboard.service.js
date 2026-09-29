const { User, Question, Assessment, AssessmentAttempt } = require('../models');

class DashboardService {
  normalizePercentage(value) {
    const numericValue = Number(value || 0);
    if (!Number.isFinite(numericValue)) {
      return 0;
    }

    return Number(numericValue.toFixed(2));
  }

  buildPerformanceMap(items, keyName, valueName) {
    const map = new Map();

    items.forEach((item) => {
      const label = item[keyName] || 'General';
      const percentage = Number(item[valueName] || 0);

      if (!map.has(label)) {
        map.set(label, { total: 0, count: 0 });
      }

      const group = map.get(label);
      group.total += percentage;
      group.count += 1;
    });

    return Array.from(map.entries())
      .map(([label, group]) => ({
        [keyName]: label,
        averagePercentage: group.count ? this.normalizePercentage(group.total / group.count) : 0
      }))
      .sort((a, b) => b.averagePercentage - a.averagePercentage);
  }

  async getUserDashboard(userId) {
    const completedAttempts = await AssessmentAttempt.find({ user: userId, status: 'COMPLETED' })
      .populate({ path: 'assessment', select: 'title technology topic difficulty' })
      .sort({ completedAt: -1, createdAt: -1 });

    if (!completedAttempts.length) {
      return {
        stats: {
          completedAssessments: 0,
          averageScore: 0,
          bestScore: 0,
          questionsAttempted: 0
        },
        recentAttempts: [],
        technologyPerformance: [],
        topicPerformance: []
      };
    }

    let totalPercentage = 0;
    let bestScore = 0;
    let questionsAttempted = 0;
    const technologyEntries = [];
    const topicEntries = [];

    completedAttempts.forEach((attempt) => {
      const percentage = this.normalizePercentage(attempt.percentage);
      totalPercentage += percentage;
      bestScore = Math.max(bestScore, percentage);

      const uniqueQuestionIds = new Set(
        (attempt.answers || [])
          .map((answer) => (answer && answer.question ? String(answer.question) : null))
          .filter(Boolean)
      );
      questionsAttempted += uniqueQuestionIds.size;

      const assessment = attempt.assessment;
      if (assessment) {
        technologyEntries.push({
          technology: assessment.technology || 'General',
          value: percentage
        });

        topicEntries.push({
          topic: assessment.topic || 'General',
          value: percentage
        });
      }
    });

    const recentAttempts = completedAttempts.slice(0, 5).map((attempt) => {
      const assessment = attempt.assessment;

      return {
        attemptId: attempt._id,
        assessmentId: assessment ? assessment._id : null,
        title: assessment ? assessment.title || 'Unknown Assessment' : 'Deleted Assessment',
        technology: assessment ? assessment.technology || 'N/A' : 'N/A',
        topic: assessment ? assessment.topic || 'N/A' : 'N/A',
        difficulty: assessment ? assessment.difficulty || 'N/A' : 'N/A',
        score: Number(attempt.score || 0),
        maxScore: Number(attempt.maxScore || 0),
        percentage: this.normalizePercentage(attempt.percentage),
        completedAt: attempt.completedAt
      };
    });

    const technologyPerformance = this.buildPerformanceMap(technologyEntries, 'technology', 'value');
    const topicPerformance = this.buildPerformanceMap(topicEntries, 'topic', 'value');

    return {
      stats: {
        completedAssessments: completedAttempts.length,
        averageScore: this.normalizePercentage(totalPercentage / completedAttempts.length),
        bestScore: this.normalizePercentage(bestScore),
        questionsAttempted
      },
      recentAttempts,
      technologyPerformance,
      topicPerformance
    };
  }

  async getAdminDashboard() {
    const [
      totalUsers,
      totalQuestions,
      totalAssessments,
      publishedAssessments,
      completedAttemptsCount,
      completedAttemptRecords
    ] = await Promise.all([
      User.countDocuments({}),
      Question.countDocuments({}),
      Assessment.countDocuments({}),
      Assessment.countDocuments({ isPublished: true }),
      AssessmentAttempt.countDocuments({ status: 'COMPLETED' }),
      AssessmentAttempt.find({ status: 'COMPLETED' }).select('percentage').lean()
    ]);

    const totalPercentage = completedAttemptRecords.reduce((sum, attempt) => {
      const percentage = Number(attempt.percentage || 0);
      return sum + (Number.isFinite(percentage) ? percentage : 0);
    }, 0);

    const averagePlatformScore = completedAttemptsCount
      ? this.normalizePercentage(totalPercentage / completedAttemptsCount)
      : 0;

    const recentAttempts = await AssessmentAttempt.find({ status: 'COMPLETED' })
      .populate({ path: 'user', select: 'name email' })
      .populate({ path: 'assessment', select: 'title' })
      .sort({ completedAt: -1, createdAt: -1 })
      .limit(10)
      .lean();

    const popularAssessments = await AssessmentAttempt.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: '$assessment', attempts: { $sum: 1 } } },
      { $sort: { attempts: -1, _id: 1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'assessments',
          localField: '_id',
          foreignField: '_id',
          as: 'assessment'
        }
      },
      { $unwind: { path: '$assessment', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          assessmentId: '$_id',
          title: { $ifNull: ['$assessment.title', 'Deleted Assessment'] },
          attempts: 1
        }
      }
    ]);

    return {
      stats: {
        totalUsers,
        totalQuestions,
        totalAssessments,
        publishedAssessments,
        completedAttempts: completedAttemptsCount,
        averagePlatformScore
      },
      recentAttempts: recentAttempts.map((attempt) => ({
        attemptId: attempt._id,
        user: attempt.user
          ? {
              name: attempt.user.name || 'Unknown User',
              email: attempt.user.email || 'unknown@example.com'
            }
          : {
              name: 'Deleted User',
              email: 'deleted@example.com'
            },
        assessment: attempt.assessment
          ? { title: attempt.assessment.title || 'Unknown Assessment' }
          : { title: 'Deleted Assessment' },
        score: Number(attempt.score || 0),
        maxScore: Number(attempt.maxScore || 0),
        percentage: this.normalizePercentage(attempt.percentage),
        completedAt: attempt.completedAt
      })),
      popularAssessments
    };
  }
}

module.exports = new DashboardService();
