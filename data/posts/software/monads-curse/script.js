(
    function () {
        if (!window.Anim) return;
        const Anim = window.Anim;

        const hero = document.getElementById('anim-hero');
        if (hero) Anim.mascot(hero, "The Monad Mascot", { word: "MONAD", accent: "#c29ffd" });

        const dataFlow = document.getElementById('anim-data-flow');
        if (dataFlow) Anim.table(dataFlow, "Data: State vs Input", {
            headers: ["Paradigm", "Input", "Result"],
            rows: [["OOP", "O(x)", "Mutated State"], ["FP", "y = f(x)", "Pure Output"]],
            accent: "#ff7eb9"
        });

        const hof = document.getElementById('anim-higher-order');
        if (hof) Anim.flow(hof, "Higher Order Functions", ["Data x", "λ Func g", "Result y"], { accent: "#7afcff" });

        const closure = document.getElementById('anim-closure');
        if (closure) Anim.codeReveal(closure, "The Private Backpack", "function closure()\n  local x = 0\n  return function()\n    x = x + 1\n    return x\n  end\nend", { accent: "#7afcff" });

        const pkg = document.getElementById('anim-package');
        if (pkg) Anim.boom(pkg, "The Monad Package", { word: "WRAP", subtitle: "A Brand New Package", accent: "#c29ffd" });

        const teleport = document.getElementById('anim-teleport');
        if (teleport) Anim.typing3d(teleport, "The Teleportation Clause", ["If you say 'keep the package empty'...", "The item teleports away.", "The package remains empty."], { accent: "#ff7eb9" });

        const maybe = document.getElementById('anim-maybe');
        if (maybe) Anim.tree(maybe, "Maybe Monad Chain", [
            {
                symbol: "40", label: "start", children: [
                    {
                        symbol: "20", label: "half", children: [
                            {
                                symbol: "10", label: "half", children: [
                                    { symbol: "5", label: "half" }
                                ]
                            }
                        ]
                    }
                ]
            }
        ], { accent: "#7afcff" });

        const lazy = document.getElementById('anim-lazy');
        if (lazy) Anim.lowerThird(lazy, "Lazy Monad", { name: "Deferred Evaluation", subtitle: "Nothing runs until :eval()", accent: "#c29ffd" });
    }
)();
