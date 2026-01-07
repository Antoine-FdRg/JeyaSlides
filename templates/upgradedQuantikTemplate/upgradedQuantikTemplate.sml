template:
  name: upgradedQuantikTemplate
  defaults:
    background:
      color: #fcf3e3

    textStyles:
      h1:
        align: center
        font:
          name: "Playfair Display"
          size: 52
          color: #6f0505
        transformations:
          - bold
          - italic

      h2:
        align: center
        font:
          name: "Playfair Display"
          size: 36
          color: #3c278a
        transformations:
          - bold

      p:
        font:
          name: "Courier New"
          size: 24
          color: #127020

  titleTemplate:
    elements:
      - text:
          content: "Université Côte d'Azur"
          align: center
      - image:
          link: "../../templates/upgradedQuantikTemplate/assets/quantikLogo.jpg"
          style:
            size:
              width: 10
              height: 10

  bodyTemplate:
    elements:
      - group:
          elements:
            - text:
                content: "Quantik - Body template"
                align: center
