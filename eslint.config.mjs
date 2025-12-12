import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";

export default [
    {
        files: ["**/*.{js,mjs,cjs,vue}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            },
            ecmaVersion: 2022,
            sourceType: "module"
        }
    },
  
    js.configs.recommended,
    ...pluginVue.configs["flat/recommended"],
  
    {
        rules: {
            // Code Quality
            "no-unused-vars": ["error", { 
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_" 
            }],
            "no-console": ["warn", { 
                allow: ["warn", "error"] 
            }],
            "no-debugger": "error",
      
            // Vue
            "vue/multi-word-component-names": ["error", {
                "ignores": ["Home", "Profile", "Statistics", "Impressum", "FAQ"]
            }],
            "vue/no-unused-components": "error",
            "vue/no-unused-vars": "error",
            "vue/require-default-prop": "warn",
            "vue/require-prop-types": "warn",
            "vue/no-v-html": "warn",
      
            // Best Practices
            "eqeqeq": ["error", "always"],
            "curly": ["error", "all"],
            "no-var": "error",
            "prefer-const": "error",
            "prefer-arrow-callback": "warn",
            "no-duplicate-imports": "error",
      
            // Style
            "indent": ["error", 4, { "SwitchCase": 1 }],
            "quotes": ["error", "double", { "avoidEscape": true }],
            "semi": ["error", "always"],
            "comma-dangle": ["error", "never"],
            "object-curly-spacing": ["error", "always"]
        }
    },
  
    {
        files: ["**/*.spec.js", "**/*.test.js"],
        languageOptions: {
            globals: {
                describe: "readonly",
                it: "readonly",
                expect: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                vi: "readonly"
            }
        },
        rules: {
            "no-console": "off"
        }
    }
];
