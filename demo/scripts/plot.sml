presentation:
  name: "Statistics lecture"
  author: "Boccaccio"
  slides:
    -slide:
      -title: "Study time vs test results"
            style:
              font: 30

        -text: "Each point represents a student."
            style:
              font: 28

        -plot:
            type: scatter
            data:
              xAxis: [1, 2, 3, 4, 5]
              yAxis: [8, 10, 12, 15, 18]
              labels:
                ["Student A", "Student B", "Student C", "Student D", "Student E"]
            layout:
              xLabel: "Study hours"
              yLabel: "Test score"
            position:
              x: center
              y: center
            animation:
              order: 1
