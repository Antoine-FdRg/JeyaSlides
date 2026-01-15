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
                font:
                    size: 24
                    color: #000011
                position: 50 70

        // Main formula slide
        -slide:
            -title: "The formula"
             align: center
            -text: "The kinetic energy of an object is given by:"
             align: center
            
            // Main equation - display mode (block)
            -equation: "E_k = \frac{1}{2}mv^2"
             style:
                backgroundColor: #eeeef5
                font:
                    size: 32

            -text: "where m is the mass and v is the velocity"
             align: center
             style:
                font:
                    size: 20
                    color: #bbbbbb

        // Examples with different equations
        -slide:
            -title: "Energy Conservation"
             align: center

            -group:
                style:
                    font:
                        size: 22
                    position: center
                -equation: "E_{total} = E_k + E_p"
                 align: center
                 style:
                    backgroundColor: #f0f0f0
                    font:
                        size: 28
                
                -text: "Potential energy formula:"
                 align: center
                
                -equation: "E_p = mgh"
                 align: center
                 style:
                    backgroundColor: #4a1a1a
                    font:
                        size: 28
                        color: #ffcccc

        -slide:
            -title: "Advanced Physics"
             align: center
            
            -subtitle: "Quadratic Formula"
             align: center
             style:
                font:
                    size: 28

            -equation: "x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}"
             style:
                font:
                    size: 22

            -subtitle: "Einstein's Field Equations"
             align: center
             style:
                font:
                    size: 28

            -equation: "E = mc^2"
             style:
                backgroundColor: #3a3a6a
                font:
                    size: 22
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
                font:
                    size: 28
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
                font:
                    size: 22
                    color: #808080

            -equation: "v = \frac{dx}{dt}"
             style:
                font:
                    size: 26

            -subtitle: "Acceleration"
             align: center
             style:
                font:
                    size: 22
                    color: #808080

            -equation: "a = \frac{dv}{dt} = \frac{d^2x}{dt^2}"
             style:
                font:
                    size: 26

        -slide:
            -title: "Lagrangian Mechanics"
             align: center
             style:
                font:
                    color: #0b009e

            -subtitle: "Impulse Momentum"
             align: center
             style:
                font:
                    size: 22
                    color: #4d65eb

            -equation: "p_{i} = \frac{\partial \mathcal{L}}{\partial \dot{q}_{i}}"
             style:
                backgroundColor: #4d65eb
                font:
                    size: 26
                    color: #c0c0c0

            -subtitle: "The action functional S"
             align: center
             style:
                font:
                    size: 22
                    color: #4d65eb
            
            -equation: "\forall \varphi \in C , S[\varphi] = \int_{M} d^n x \, \mathcal{L}(\varphi(x), \partial_{\varphi}(x), \partial^2\varphi(x), \ldots, x)."
             style:
                backgroundColor: #4d65eb
                font:
                    size: 26
                    color: #c0c0c0

        -slide:
            -title: "Multi-line Equations"
             align: center

            -subtitle: "Laws of Motion"
             align: center
             style:
                font:
                    size: 22
                    color: #808080

            -equation:
                - "W &= \int F \, dx"
                - "W &= \int ma \, dx = m \int \frac{dv}{dt} dx"
                - "W &= m \int_{a}^{b} v \, dv = \frac{1}{2}mv^2"
             align: center

        -slide:
            -title: "Multi-line Equation Animated"
             align: center

            -subtitle: "Derivative Calculation"
             align: center
             style:
                font:
                    size: 22
                    color: #808080

            -equation:
                - "f(x) = \sin(x^2)"
                - "f'(x) = \cos(x^2) \cdot \frac{d}{dx}{x^2}"
                - "f'(x) = \cos(x^2) \cdot 2x"
                - "f'(x) = 2x\cos(x^2)"
             animated: true
             align: center