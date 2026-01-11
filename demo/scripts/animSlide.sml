presentation:
  slides:
    -slide:
      -title: "Animation Slide"
      -text: "Click to reval the next text"
      - text: "Click again to see the next lines at the same time."
        animation:
          order: 1
      - text: "This is the second animated line."
        animation:
          order: 2
      - text: "Finally, this is the third animated line."
        animation:
          order: 2
    
    -slide:
      -title: "What is Superposition?"
        style:
          font: 28
      -text: "Extrait explicatif depuis YouTube"
        style:
          backgroundColor: #fec7f0
          font: 16
          
      -video:
          link: "https://www.youtube.com/watch?v=l5Eu4XVwZZs"
          style:
            size: 50 40
            rotation: 10
          animation:
            order: 1
    -slide:
      -title:   "Line animated Code"
      - code:
        language: "javascript"
        animated: true 
          "
          const x = 1;
          const y = 2;
          const z = x + y;
          "
        explanations:
          - 1: "Declares a constant x with value 1"
          - 2: "Declares a constant y with value 2"
          - 3: "Declares a constant z as the sum of x and y"
    -slide:
      -text: "Image issue du web"
            style:
              backgroundColor: #fec7f0
              font: 16
      -image:
          link: "https://amphisciences.ouest-france.fr/wp-content/uploads/2024/10/AdobeStock_271324836-1280x640.jpeg"
          style:
            size: 70 40
            rotation: 5
          animation:
            order: 1