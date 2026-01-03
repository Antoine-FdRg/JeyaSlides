presentation: 
  name: "Style tests!" 
  author: "Antoine"
  slides:
    -slide:
      transition:
        type: zoom-in
        duration: 300
      elements:
        -text: 
          content: "test zoom-in"
          style:
            backgroundColor: #f14b4b

    -slide:
      transition:
        type: zoom
        duration: 700
      elements:
        -text: 
          content: "Test zoom à 700ms"
          

    -slide:
      transition:
        type: convex
        duration: 1100
      elements:
        -text: 
          content: "test convex à 1100 ms"
          style:
            size:
              width: 70
              height: 70
            backgroundColor: #0bac0b
            

    -slide:
      transition:
        type: concave
        duration: 900
      elements:
        -text: 
          content: "Test concave à 900ms"
          style:
            size:
              width: 10
              height: 10
            backgroundColor: #555
        

    -slide:
      transition:
        type: slide
        duration: 300
      elements:
        -text: 
            content: "test transition slide 300ms"
            style:
            size:
                width: 70
            backgroundColor: #888

    -slide:
      transition:
        type: fade
        duration: 400
      elements:
        -text: 
          content: "Text fade à 400ms"
          style:
            backgroundColor: #a0a005
            font:
              name: "Times New Roman"
        

    -slide:
      transition:
        type: zoom-in fade-out
        duration: 1200
      elements:
        -text: 
          content: "Test zoom-in fade-out à 1200ms"
          style:
            backgroundColor: #5a05a0
            font:
              name: "Courier New"
              size: 64
              color: #ff00ff
              transformations:
                - bold
                - italic
                - underline
