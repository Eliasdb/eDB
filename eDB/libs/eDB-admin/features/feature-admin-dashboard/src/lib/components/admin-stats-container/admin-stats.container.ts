import { Component, OnInit, ViewChild, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AdminService } from '@eDB/client-admin';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { BehaviorSubject } from 'rxjs';
import { AdminStatsCardComponent } from '../admin-stats-card/admin-stats-card.component';

@Component({
  imports: [AdminStatsCardComponent, MatCardModule],
  selector: 'admin-stats-container',
  template: `
    <section class="stats-container">
      <section class="cards-container">
        @if (queryAdminStats.data(); as data) {
          <admin-stats-card
            [count]="data.bookCount"
            [subText]="'total books'"
          ></admin-stats-card>
          <admin-stats-card
            [count]="data.loanedBooksCount"
            [subText]="'book(s) loaned'"
          ></admin-stats-card>
          <admin-stats-card
            [count]="data.userCount"
            [subText]="'total users'"
          ></admin-stats-card>
        }
      </section>
      <!-- <section class="graphs-container">
        <mat-card>
          <div class="by-genre-title">
            <h3>Books by genre</h3>
          </div>
          <mat-card-content>
            <section class="donut-graph">
              <canvas
                *ngIf="loaded"
                baseChart
                class="donut-chart"
                [data]="doughnutChartData"
                [type]="'doughnut'"
                [options]="doughnutChartOptions"
              ></canvas>
            </section>
          </mat-card-content>
        </mat-card>
      </section> -->
    </section>
  `,
  styleUrls: ['./admin-stats.container.scss'],
})
export class AdminStatsContainer implements OnInit {
  loaded = false;
  private adminService = inject(AdminService);

  // The new query returns signals rather than a result$ observable.
  queryAdminStats = this.adminService.queryAdminStats;

  // Compute derived signals based on queryAdminStats.data()
  totalsByGenre = computed(() => {
    const data = this.queryAdminStats.data();
    return data ? data.totalsByGenre : [];
  });

  userPostData = computed(() => {
    const data = this.queryAdminStats.data();
    return data && data.userData ? data.userData.map((user) => user.user) : [];
  });

  userPostPostData = computed(() => {
    const data = this.queryAdminStats.data();
    return data && data.userData ? data.userData.map((user) => user.posts) : [];
  });

  userCommentPostData = computed(() => {
    const data = this.queryAdminStats.data();
    return data && data.userData
      ? data.userData.map((user) => user.comments)
      : [];
  });

  cityData = computed(() => {
    const data = this.queryAdminStats.data();
    return data && data.totalsByCity
      ? data.totalsByCity.map((city) => city.city)
      : [];
  });

  cityCountData = computed(() => {
    const data = this.queryAdminStats.data();
    return data && data.totalsByCity
      ? data.totalsByCity.map((city) => city.count)
      : [];
  });

  public doughnutChartLabels: string[] = [
    'Action',
    'Adventure',
    'Comedy',
    'Crime',
    'Drama',
    'Fantasy',
    'History',
    'Horror',
    'Mystery',
    'Non Fiction',
    'Thriller',
  ];

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [{ data: [] }],
  };

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false,
    layout: {},
    plugins: {
      legend: {
        labels: {
          padding: 20,
          color: 'grey',
        },
        position: 'left',
      },
    },
  };

  public doughnutChartType: ChartType = 'doughnut';

  // Chart events
  public chartClicked({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    console.log(event, active);
  }

  users$ = new BehaviorSubject<string[]>([]);
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    scales: {
      x: { min: 0, max: 5 },
      y: {},
    },
    indexAxis: 'y',
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'white',
        },
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: 'white',
      },
    },
  };

  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Posts' },
      { data: [], label: 'Comments' },
    ],
  };

  public polarAreaChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
        },
      },
      datalabels: {
        color: 'white',
        backgroundColor: 'white',
      },
    },
  };

  public polarAreaChartData: ChartData<'polarArea'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Users',
      },
    ],
  };
  public polarAreaLegend = true;
  public polarAreaChartType: ChartType = 'polarArea';

  ngOnInit(): void {
    // Use the computed signals to initialize your chart data.
    const totals = this.totalsByGenre();
    this.doughnutChartData.datasets[0].data = totals;
    this.loaded = true;

    this.barChartData.labels = this.userPostData();
    this.barChartData.datasets[0].data = this.userPostPostData();
    this.barChartData.datasets[1].data = this.userCommentPostData();

    this.polarAreaChartData.labels = this.cityData();
    this.polarAreaChartData.datasets[0].data = this.cityCountData();
  }
}
