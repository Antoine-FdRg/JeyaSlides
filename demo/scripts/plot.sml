presentation:
  name: "Statistics lecture"
  author: "Boccaccio"
  slides:
    -slide:
      elements:
        -title:
            content: "Study time vs test results"
            style:
              font:
                size: 30

        -text:
            content: "Each point represents a student."
            style:
              font:
                size: 28

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
