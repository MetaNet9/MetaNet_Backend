import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vebxrmodel } from 'src/vebxrmodel/entities/vebxrmodel.entity';
import { Category } from 'src/category/category.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { User } from 'src/users/user.entity';
import { count } from 'console';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Vebxrmodel)
    private readonly vebxrmodelRepository: Repository<Vebxrmodel>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Get date range for the last month
  private getLastMonthRange() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    return { startOfMonth, endOfMonth };
  }

  // Get date range for the last week
  private getLastWeekRange() {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7); // 7 days ago
    return { startOfWeek, endOfWeek: now };
  }

  // Get category-wise revenue for the last month
  private async getCategoryRevenueLastMonth() {
    const { startOfMonth, endOfMonth } = this.getLastMonthRange();

    const results = await this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.model', 'model')
      .innerJoin('model.category', 'category')
      .select('category.name', 'categoryName')
      .addSelect('SUM(payment.amount)', 'totalRevenue')
      .where('payment.purchasedAt BETWEEN :startOfMonth AND :endOfMonth', {
        startOfMonth,
        endOfMonth,
      })
      .groupBy('category.name')
      .getRawMany();

    return results;
  }

  // Get day-wise revenue for the last week
  private async getCategoryRevenueLastWeek() {
    const { startOfWeek, endOfWeek } = this.getLastWeekRange();

    const results = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('DATE(payment.purchasedAt)', 'date')
      .addSelect('SUM(payment.amount)', 'totalRevenue')
      .where('payment.purchasedAt BETWEEN :startOfWeek AND :endOfWeek', {
        startOfWeek,
        endOfWeek,
      })
      .groupBy('DATE(payment.purchasedAt)')
      .orderBy('DATE(payment.purchasedAt)', 'ASC')
      .getRawMany();

    const dailySales = results.map(({ date, totalRevenue }) => ({
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
      value: parseFloat(totalRevenue),
    }));

    return dailySales;
  }

  // Calculate statistics and improvements
  async getStatistics() {
    // All-time statistics
    const totalModels = await this.vebxrmodelRepository.count();
    const totalUsers = await this.userRepository.count();

    const totalRevenue = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'totalRevenue')
      .getRawOne();

    const totalPurchases = await this.paymentRepository.count();

    const totalLikes = await this.vebxrmodelRepository
      .createQueryBuilder('model')
      .select('SUM(model.likes)', 'totalLikes')
      .getRawOne();

    const totalDownloads = await this.vebxrmodelRepository
      .createQueryBuilder('model')
      .select('SUM(model.downloads)', 'totalDownloads')
      .getRawOne();

    const mostPopularModel = await this.vebxrmodelRepository
      .createQueryBuilder('model')
      .orderBy('model.downloads', 'DESC')
      .addOrderBy('model.likes', 'DESC')
      .getOne();

    // Last week's statistics
    const { startOfWeek, endOfWeek } = this.getLastWeekRange();

    const newModelsLastWeek = await this.vebxrmodelRepository
      .createQueryBuilder('model')
      .where('model.createdAt BETWEEN :startOfWeek AND :endOfWeek', {
        startOfWeek,
        endOfWeek,
      })
      .getCount();

    const newUsersLastWeek2 = await this.userRepository
      .createQueryBuilder('user')
      .where('user.createdAt BETWEEN :startOfWeek AND :endOfWeek', {
        startOfWeek,
        endOfWeek,
      })

    // :todo: Fix this

    const newUsersLastWeek = 2;

    const lastWeekRevenueData = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'lastWeekRevenue')
      .where('payment.purchasedAt BETWEEN :startOfWeek AND :endOfWeek', {
        startOfWeek,
        endOfWeek,
      })
      .getRawOne();
    const lastWeekRevenue = parseFloat(lastWeekRevenueData.lastWeekRevenue || 0);

    // Improvement calculations
    const modelsImprovement = ((newModelsLastWeek / (totalModels || 1)) * 100).toFixed(2);
    const usersImprovement = ((newUsersLastWeek / (totalUsers || 1)) * 100).toFixed(2);
    const revenueImprovement = ((lastWeekRevenue / (totalRevenue.totalRevenue || 1)) * 100).toFixed(2);

    // Fetch revenue details
    const lastMonthRevenue = await this.getCategoryRevenueLastMonth();
    const lastWeekCategoryRevenue = await this.getCategoryRevenueLastWeek();

    return {
      totalModels,
      totalUsers,
      totalRevenue: totalRevenue.totalRevenue || 0,
      totalPurchases,
      totalLikes: totalLikes.totalLikes || 0,
      totalDownloads: totalDownloads.totalDownloads || 0,
      mostPopularModel,
      lastMonthRevenue,
      lastWeekRevenue: lastWeekCategoryRevenue,
      newModelsLastWeek,
      newUsersLastWeek,
      improvement: {
        models: `${modelsImprovement}%`,
        users: `${usersImprovement}%`,
        revenue: `${revenueImprovement}%`,
      }
    };
  }
}
