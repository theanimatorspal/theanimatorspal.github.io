(
    function () {
        if (!window.Anim) return;
        const Anim = window.Anim;

        const hero = document.getElementById('anim-hero');
        if (hero) Anim.mascot(hero, "The Monad Mascot", {
            word: "MONAD",
            accent: "#c29ffd",
            in: { y: -1200, rotate: -15, duration: 2, ease: "back.out(1.5)" }
        });

        const dataFlow = document.getElementById('anim-data-flow');
        if (dataFlow) Anim.table(dataFlow, "Data: State vs Input", {
            headers: ["Paradigm", "Input", "Result"],
            rows: [["OOP", "O(x)", "Mutated State"], ["FP", "y = f(x)", "Pure Output"]],
            accent: "#ff7eb9",
            in: { x: -1920, duration: 1.5, ease: "power4.out" }
        });

        const hof = document.getElementById('anim-higher-order');
        if (hof) Anim.flow(hof, "Higher Order Functions", ["कस्तो", "यस्तो", "रस्तो"], {
            accent: "#787affff",
            in: { scale: 0, opacity: 0, duration: 1, ease: "elastic.out(1, 0.3)" }
        });

        const closure = document.getElementById('anim-closure');
        if (closure) Anim.codeReveal(closure, "The Private Backpack", "function closure()\n  local x = 0\n  return function()\n    x = x + 1\n    return x\n  end\nend", {
            accent: "#7afcff",
            in: { y: 1200, rotate: 10, duration: 2, ease: "expo.out" }
        });

        const pkg = document.getElementById('anim-package');
        if (pkg) Anim.boom(pkg, "The Monad Package", {
            word: "WRAP",
            subtitle: "A Brand New Package",
            accent: "#c29ffd",
            in: { x: 1920, rotate: 45, duration: 1.5, ease: "slow(0.7, 0.7, false)" },
            out: { y: 500, opacity: 0, duration: 1.5, ease: "power4.in" }
        });

        const teleport = document.getElementById('anim-teleport');
        if (teleport) Anim.typing3d(teleport, "The Teleportation Clause", ["If you say 'keep the package empty'...", "The item teleports away.", "The package remains empty."], {
            accent: "#ff7eb9",
            in: { x: -1920, rotate: -5, duration: 1.4, ease: "power4.out" }
        });

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
        ], {
            accent: "#7afcff",
            in: { scale: 1.5, opacity: 0, duration: 2, ease: "expo.inOut" }
        });

        const lazy = document.getElementById('anim-lazy');
        if (lazy) Anim.lowerThird(lazy, "Lazy Monad", {
            name: "Deferred Evaluation",
            subtitle: "Nothing runs until :eval()",
            accent: "#9161e4ff",
            in: { x: -500, y: -500, opacity: 0, duration: 0.3, ease: "back.out(1.7)" },
            out: { x: 500, y: 0, opacity: 0, scale: 0.8, duration: 0.1 }
        });
    }
)();
