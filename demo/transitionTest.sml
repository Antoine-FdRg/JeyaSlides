presentation: 
  name: "Style tests!" 
  author: "Emma"
  slides:
    -slide:
      transition:
        type: zoom-in
        duration: slow
      elements:
        -text: 
          content: "test zoom-in"
          style:
            backgroundColor: #f14b4b

    -slide:
      transition:
        type: zoom
        duration: fast
      elements:
        -text: 
          content: "Test zoom à fast"
          

    -slide:
      transition:
        type: convex
        duration: fast
      elements:
        -text: 
          content: "test convex à fast"
          style:
            size:
              width: 70
              height: 70
            backgroundColor: #0bac0b
            

    -slide:
      transition:
        type: concave
        duration: default
      elements:
        -text: 
          content: "Test concave à default"
          style:
            size:
              width: 10
              height: 10
            backgroundColor: #555
        

    -slide:
      transition:
        type: slide
        duration: slow
      elements:
        -text: 
            content: "test transition slide slow"
            style:
            size:
                width: 70
            backgroundColor: #888

    -slide:
      transition:
        type: fade
        duration: default
      elements:
        -text: 
          content: "Text fade à default"
          style:
            backgroundColor: #a0a005
            font:
              name: "Times New Roman"
        

    -slide:
      transition:
        type: zoom-in fade-out
        duration: fast
      elements:
        -text: 
          content: "Test zoom-in fade-out à fast"
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
