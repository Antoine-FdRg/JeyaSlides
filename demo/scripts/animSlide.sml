presentation:
  slides:
    -slide:
      elements:
        -title: 
          content: "Animation Slide"
        -text:
          content: 
          "Click to reval the next text"
        -text:
          content:
          "Click again to see the next lines at the same time."
          animation:
            order: 1
        -text:
          content:
          "This is the second animated line."
          animation:
            order: 2
        -text:
          content:
          "Finally, this is the third animated line."
          animation:
            order: 2
    
    -slide:
      elements:
        -title:
            content: "What is Superposition?"
            style:
              font:
                size: 28
        -text:
            content: "Extrait explicatif depuis YouTube"
            style:
              backgroundColor: #fec7f0
              font:
                size: 16
              
        -video:
            link: "https://www.youtube.com/watch?v=l5Eu4XVwZZs"
            style:
              size:
                width: 50
                height: 40
              rotation: 10
            animation:
              order: 1
    -slide:
      elements:
        -text:
            content: "Image issue du web"
            style:
              backgroundColor: #fec7f0
              font:
                size: 16
        -image:
            link: "https://amphisciences.ouest-france.fr/wp-content/uploads/2024/10/AdobeStock_271324836-1280x640.jpeg"
            style:
              size:
                width: 70
                height: 40
              rotation: 5
            animation:
              order: 1
    -slide:
      elements:
        -title: 
          content: "Line animated Code"
        -group:
          position:
            x: center
          elements:
            -code:
              animated: true
              content: 
              " 
                sum = 0
                for i in range(10):
                    sum += i
                    print(sum)
              "
            -text:
              content: "initializes sum to zero"
              animation:
                order: 1
            -text:
              content: "iterates from 0 to 9"
              animation:
                order: 2
            -text:
              content: "adds i to sum in each iteration"
              animation:
                order: 3
            -text:
              content: "prints the current value of sum"  
              animation:
                order: 4
