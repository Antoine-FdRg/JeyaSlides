template "test" {
  style {
    backgroundColor "#FFFFFF"
    font {
      name "Arial"
      size 14
      color #000000
      transformations [bold, italic]
    }
    transition "slide-left"
  }
  titleTemplate {
     image { 
      src "https://example.com/logo.png"
      width 10
      height 5
      position {
        x 88
        y 1
      }
    }
    {
      text {
         """Team Name"""
        font {
          name "Verdana"
          size 24
          color #f5f5f5ff
          transformations [bold]
        }
        position {
          x 5
          y 50
        }
      }
      width 100
      height 10
      backgroundColor #18348fff
      position {
        x 0
        y 90
      }
    }
    width 100
    height 100
  }

  bodyTemplate {
    {
      {
        text """Team Name"""
        font {
          name "Verdana"
          size 24
          color #f5f5f5ff
          transformations [bold]
        }
        position {
          x 5
          y 50
        }
      }
      width 100
      height 10
      backgroundColor #18348fff
      position {
        x 0
        y 90
      }
    }
    width 100
    height 100
  }
}

presentation "Demo Presentation" {
  author "Antoine"
  displayPageNumber true
  templates "test"
  slides {
    slide {
      {
        title """Welcome to the Demo Presentation"""
        style {
          font {
            size 32
            transformations [bold]
          }
        }
      }
      {
        text """This is the first slide of the demo presentation."""
        position {
          x CENTER
          y CENTER
        }
      }
    }
    slide transition slide-top {
      {title """About Us"""}
      {body """We are a team of dedicated professionals specializing in :"""
        position {
          x LEFT
          y CENTER
        }
      }
      {
        list [
          "Software Development",
          "Data Science",
          "Machine Learning",
          "Cloud Computing"
        ]
        position {
          x LEFT
          y 60
        }
      }
    }
  }
}