presentation:
    slides:
        // Introduction Slide
        -slide:
            -title: "Physics Lecture"
             align: center
             position: center
            -text: "Understanding motion and energy"
             align: center
             style:
                font: 24
                position: 50 70

        // Main formula slide
        -slide:
            -title: "The formula"
             align: center
            -text: "The kinetic energy of an object is given by:"
             align: center
            
            // Main equation - display mode (block)
            -equation: "E_k | = \frac{1}{2}mv^2"
            equationAnimation:
                split: " | "
             style:
                backgroundColor: #eeeef5
                font: 32

            -text: "where m is the mass and v is the velocity"
             align: center
             style:
                font: 20
                    color: #bbbbbb

        -slide:
            -title: "Advanced Physics"
             align: center
            
            -subtitle: "Quadratic Formula"
             align: center
             style:
                font: 28

            -equation: "x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}"
             style:
                font: 22

            -subtitle: "Einstein's Field Equations"
             align: center
             style:
                font: 28

            -equation: "E = mc^2"
             style:
                backgroundColor: #3a3a6a
                font: 22
                    color: #ffffff
                    transformations:
                        - bold
        
        // Mixed inline and block equations
        -slide:
            -title: "Work and Force"
             align: center
            
            -text: "Work done by a constant force"
             align: center
            
            -equation: "W = F \cdot d \cos(\theta)"

            -text: "Newton's Second Law"
             align: center
             position: 50 60

            -equation: "F = ma"
             style:
                backgroundColor: #4a2a1a
                font: 28
                    color: #ffffff
                position: 50 75

        // Animation, LSP LaTex rendering
        // Complex mathematic expressions
        -slide:
            -title: "Calculus in Physics"
             align: center

            -subtitle: "Velocity as derivative"
             align: center
             style:
                font: 22
                    color: #808080

            -equation: "v = \frac{dx}{dt}"
             style:
                font: 26

            -subtitle: "Acceleration"
             align: center
             style:
                font: 22
                color: #808080

            -equation: "a = \frac{dv}{dt} = \frac{d^2x}{dt^2}"
             style:
                font: 26

        -slide:
            -title: "Lagrangian Mechanics"
             align: center
             style:
                font:
                    color: #0b009e

            -subtitle: "Impulse Momentum"
             align: center
             style:
                font: 22
                    color: #4d65eb

            -equation: "p_{i} = \frac{\partial \mathcal{L}}{\partial \dot{q}_{i}}"
             style:
                backgroundColor: #4d65eb
                font: 26
                color: #c0c0c0

            -subtitle: "The action functional S"
             align: center
             style:
                font: 22
                color: #4d65eb
            
            -equation: "\forall \varphi \in C , S[\varphi] = \int_{M} d^n x \, \mathcal{L}(\varphi(x), \partial_{\varphi}(x), \partial^2\varphi(x), \ldots, x)."
             style:
                backgroundColor: #4d65eb
                font: 26
                    color: #c0c0c0

        -slide:
            -title: "Multi-line Equations"
             align: center

            -subtitle: "Laws of Motion"
             align: center
             style:
                font: 22
                    color: #808080

            -equation:
                - "W &= \int F \, dx"
                - "W &= \int ma \, dx = m \int \frac{dv}{dt} dx"
                - "W &= m \int_{a}^{b} v \, dv = \frac{1}{2}mv^2"
                equationAnimation: enabled

             align: center

        -slide:
            -title: "Multi-line Equation Animated"
             align: center

            -subtitle: "Derivative Calculation"
             align: center
             style:
                font: 22
                color: #808080

            -equation:
                - "f(x) = \sin(x^2)"
                - "f'(x) = \cos(x^2) \cdot \frac{d}{dx}{x^2}"
                - "f'(x) = \cos(x^2) \cdot 2x"
                - "f'(x) = 2x\cos(x^2)"
             equationAnimation: enabled
             align: center

        -slide:
            -title: "Equation Animation with Split"
             align: center

            -subtitle: "Build equation progressively on same line"
             align: center
             style:
                font: 22
                color: #808080

            -equation: "2x + 5 | = 15"
             equationAnimation:
                split: " |"
             style:
                font: 28
                color: #f63f3f

        -slide:
            -title: "Equation Resolution"
             align: center

            -subtitle: "Solve step by step"
             align: center
             style:
                font: 20 
                color: #808080

            -equation: "2x+5=15 | \Rightarrow 2x =10 | \Rightarrow x =5"
             equationAnimation:
                split: " | "
             style:
                font: 26
