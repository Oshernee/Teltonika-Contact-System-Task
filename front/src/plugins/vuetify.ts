import { createVuetify } from "vuetify";
import "vuetify/dist/vuetify.min.css";
import { md3 } from "vuetify/blueprints";

const vuetify = createVuetify({
  blueprint: md3,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#0054A6",
          secondary: "#1F3F77",
          error: "#A61A11",
          surface: "#F1F2F4",
          background: "#FFFFFF",
          "on-surface": "#414042",
          "on-background": "#000000",
        },
      },
    },
  },
});

export default vuetify;
