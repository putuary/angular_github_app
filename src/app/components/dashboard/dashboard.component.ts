import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { Repository } from '../../interfaces/repository';
import { RepositoryDetail } from '../../interfaces/repository-detail';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private root!: am5.Root;
  completed: boolean = false;
  userInfo: any = {};
  userRepositories: any = {};
  repoLanguages: Repository[] = [];
  repoDetails: any[]=[];
  totalLanguages: number = 0;


  ngOnInit() {
    this.authService.getAuthUser().subscribe({
      next: response => {
        this.userInfo = response
        console.log(this.userInfo);
        this.getUserRepositories(this.userInfo.login);
        this.showChart();
      },
      error: err => alert(err.message),
      complete: () => this.completed=true,
    });
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone, private authService: AuthService, private userService: UserService) {}

  getUserRepositories(userName: string) {
    this.userService.getUserRepositories(userName).subscribe({
      next: response => {
        this.userRepositories = response
        console.log(this.userRepositories);
      },
      error: err => alert(err.message),
      complete: () => {
        this.completed = true;
        this.getRepoLanguage(this.userRepositories);
        this.getRepoComits(this.userRepositories);
        this.countTotalLanguage();
        this.showRepoChart();
      },
    });
  }

  getRepoLanguage(repo: any) : void {
    for (let i = 0; i < repo.length; i++) {
      if(this.repoLanguages.length === 0) {
        this.repoLanguages.push({language: repo[i].language ?? 'Unknown', count: 1});
      } else {
        if(repo[i].language == undefined) {
          if(this.repoLanguages[this.repoLanguages.length-1].language == "Unknown") {
            this.repoLanguages[this.repoLanguages.length-1].count++;
          } else {
            this.repoLanguages.push({language: 'Unknown', count: 1});
          }
        } else {
          for (let j = 0; j < this.repoLanguages.length; j++) {
            if (repo[i].language === this.repoLanguages[j].language) {
              this.repoLanguages[j].count++;
              break;
            } else if (j === this.repoLanguages.length - 1) {
              this.repoLanguages.unshift({language: repo[i].language ?? 'Unknown', count: 1});
              break;
            }
          }
        }
      }
    }
  }

  getRepoComits(repo: any) {
    for (let i = 0; i < repo.length; i++) {
      this.userService.getRepoCommits(this.userInfo.login, repo[i].name).subscribe({
        next: response => {
          this.repoDetails.push({repository: repo[i].name, count: response.length});
        },
        error: err => console.log(err.message),
        complete: () => {
          this.completed = true;
          if(this.repoDetails.length == repo.length) {
            console.log("commit", this.repoDetails);
            this.showCommitChart();
          }
        },
      })
    }

  }

  countTotalLanguage() : void {
    if(this.repoLanguages[this.repoLanguages.length-1].language == "Unknown") {
      this.totalLanguages = this.repoLanguages.length-1;
    } else {
      this.totalLanguages = this.repoLanguages.length;
    }
  }


  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  showChart() {
    this.browserOnly(() => {
      let root = am5.Root.new("piediv");
      root.setThemes([
        am5themes_Animated.new(root)
      ]);

      let chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          endAngle: 270
        })
      );

      let series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: "value",
          categoryField: "category",
          endAngle: 270
        })
      );

      series.states.create("hidden", {
        endAngle: -90
      });

      series.data.setAll([{
        category: "Private",
        value: this.userInfo.owned_private_repos
      },{
        category: "Public",
        value: this.userInfo.public_repos
      }
    ]);

      series.appear(1000, 100);
    });
  }

  showRepoChart() {
    // Chart code goes in here
    this.browserOnly(() => {

      let root = am5.Root.new("chartdiv");

      const colorSet = am5.ColorSet.new(root, {
        step: 2,
        colors: [
          am5.color("#f94144"), // Merah terang
          am5.color("#f3722c"), // Oranye
          am5.color("#f8961e"), // Kuning oranye
          am5.color("#90be6d"), // Hijau terang
          am5.color("#577590"), // Biru gelap
        ],
      });

      root.setThemes([
        am5themes_Animated.new(root)
      ]);
      
      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        paddingLeft:0,
        paddingRight:1,
      }));

      let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
      cursor.lineY.set("visible", false);

      let xRenderer = am5xy.AxisRendererX.new(root, { 
        minGridDistance: 30, 
        minorGridEnabled: true
      });

      xRenderer.labels.template.setAll({
        rotation: -90,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15
      });

      xRenderer.grid.template.setAll({
        location: 1
      })

      let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: "language",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      }));

      let yRenderer = am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
      })

      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: yRenderer
      }));

      let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "count",
        sequencedInterpolation: true,
        categoryXField: "language",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}"
        })
      }));

      series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
      series.columns.template.adapters.add("fill", function (fill, target) {
        return colorSet.getIndex(series.columns.indexOf(target));
      });

      series.columns.template.adapters.add("stroke", function (stroke, target) {
        return colorSet.getIndex(series.columns.indexOf(target));
      });

      let data : Repository[] = this.repoLanguages;  

      xAxis.data.setAll(data);
      series.data.setAll(data);

      series.appear(1000);
      chart.appear(1000, 100);
    });
  }

  showCommitChart() {
    this.browserOnly(() => {
      let root = am5.Root.new("chartCommit");

      root.setThemes([
        am5themes_Animated.new(root)
      ]);

      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        paddingLeft:0,
        layout: root.verticalLayout
      }));

      const colorSet = am5.ColorSet.new(root, {
        step: 2,
        colors: [
          am5.color(0x73556E),
          am5.color(0x9FA1A6),
          am5.color(0xF2AA6B),
          am5.color(0xF28F6B),
          am5.color(0xA95A52),
          am5.color(0xE35B5D),
          am5.color(0xFFA446)
        ]
      });

      let xRenderer = am5xy.AxisRendererX.new(root, {
        minGridDistance: 50,
        minorGridEnabled: true
      });

      xRenderer.grid.template.setAll({
        location: 1
      })

      let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: "repository",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      }));

      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        min: 0,
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1
        })
      }));


      // Create series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "count",
        categoryXField: "repository",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}"
        }),
      }));

      series.columns.template.setAll({
        tooltipY: 0,
        tooltipText: "{categoryX}: {valueY}",
        shadowOpacity: 0.1,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        shadowBlur: 1,
        strokeWidth: 2,
        stroke: am5.color(0xffffff),
        shadowColor: am5.color(0x000000),
        cornerRadiusTL: 50,
        cornerRadiusTR: 50,
        fillGradient: am5.LinearGradient.new(root, {
          stops: [
            {}, // will use original column color
            { color: am5.color(0x000000) }
          ]
        }),
        fillPattern: am5.GrainPattern.new(root, {
          maxOpacity: 0.15,
          density: 0.5,
          colors: [am5.color(0x000000), am5.color(0x000000), am5.color(0xffffff)]
        })
      });


      series.columns.template.states.create("hover", {
        shadowOpacity: 1,
        shadowBlur: 10,
        cornerRadiusTL: 10,
        cornerRadiusTR: 10
      })

      series.columns.template.adapters.add("fill", function (fill, target) {
        return colorSet.getIndex(series.columns.indexOf(target));
      });

      // Set data
      let data = this.repoDetails;

      xAxis.data.setAll(data);
      series.data.setAll(data);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear(1000);
      chart.appear(1000, 100);

    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }
}
