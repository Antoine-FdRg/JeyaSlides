presentation: 
  slides:
    -slide:
      -text:   "Colored background"
          style:
            backgroundColor: #f14b4b
    -slide:
      -text:   "Rotated block"
          style:
            rotation: 45
    -slide:
      -text:   "Rotated colored wide block"
          style:
            size: 70 70
            backgroundColor: #0bac0b
            rotation: 45
    -slide:
      -text:   "Stretched block"
          style:
            size: 10 auto
            backgroundColor: #555
      -text:   "Normal block"
        style:
          backgroundColor: #888
      -text:   "Wide block"
        style:
          size: 80 auto
          backgroundColor: #aaa
    -slide:
      -group:[
        style:
          size: 100 auto
        backgroundColor: #ccc
            - text: "30% width of the parent group"
            style:
              size: 30 auto
              backgroundColor: #888
          - text: "50% width of the parent group"
            style:
              size: 50 auto
              backgroundColor: #888
          - text: "70% width of the parent group"
            style:
              size: 70 auto
              backgroundColor: #888
      ]
    -slide:
      -text:   "Text with custom font"
        style:
          backgroundColor: #a0a005
          font: "Times New Roman"
      -text:   "Text with custom font size"
        style:
          backgroundColor: #a0a005
          font: 30
      -text:   "Text with custom font color"
        style:
          backgroundColor: #a0a005
          font:
            color: #2a2a72
      -text:   "Text with custom font transformation"
        style:
          backgroundColor: #a0a005
          font:
            color: #2a2a72
            transformations:
              - bold
              - italic
              - underline
    -slide:
      -text:   "Text with all customizations"
        style:
          backgroundColor: #5a05a0
          font: "Courier New" 64
            color: #ff00ff
            transformations:
              - bold
              - italic
              - underline

