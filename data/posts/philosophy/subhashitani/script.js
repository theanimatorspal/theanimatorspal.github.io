(
    function () {
        if (!window.Anim) return;
        const Anim = window.Anim;

        const s1 = document.getElementById('anim-subhashita-1');
        if (s1) {
            Anim.scroll(s1, "सुभाषितम्", {
                accent: "#c8a96e",
                verse: [
                    "विद्वत्त्वं च नृपत्वं च नैव तुल्यं कदाचन ।",
                    "स्वदेशे पूज्यते राजा विद्वान् सर्वत्र पूज्यते ॥"
                ],
                meaning: [
                    "विद्वता र राजाको महानता",
                    "कहिल्यै समान हुँदैनन् ।",
                    "राजा आफ्नो राज्यमा मात्र पूजिन्छन्,",
                    "तर विद्वान संसारभर पूजिन्छन् ।"
                ],
                wipeDuration: 2.5,
                dividerDuration: 1.2,
                meaningWipeDuration: 6.0,
                holdTime: 8,
                repeatDelay: 2
            });
        }
    }
)();
