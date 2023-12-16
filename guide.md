# This is a Guide to JKR GUI

Hello everyone

## Building blocks

This section of the tutorial explains how to use our Lua JkrGUI API in order to render basics shapes and images.

### Rendering a Rectangle

* Open your main.lua file and set up your callbacks. Callbacks are functions that are called by JkrGUI. Load Callback is called before any draw and once in your program lifetime by JkrGUI, other callbacks are called once each frame, we will talk about these later. Now, Require the "jkrgui" file in your main.lua file.

```lua
    require "jkrgui"

    function Load()
    end

    function Draw()
    end

    function Event()
    end

    function Update()
    end
```

* In the load call back, create a JkrGUI Generator

```lua
    function load()
        -- vec2(<a number>, <a number>) is a built in class for storing cartesian coordinates x and y
        -- you can create a vec2 like this
        -- local pos = vec2(100, 100) represents the position at 100, 100, Here we create vec2 for a dimension
        local dimension = vec2(100, 100) -- The Width and height of the rectangle is 100, 100 respectively
        local gen = Generator(Shapes.rectangle, dimension)
    end
```

* Now add a shape using the JkrGUI builtin Shape Renderer

```lua
    function load()
        local dimension = vec2(100, 100)
        local gen = Generator(Shapes.rectangle, dimension)
        shapeid = S.Add() -- ShapeId is kept global so that we can access it in the draw call back
    end
```

* In your draw function call back, draw the Rectangle by its shapeid
