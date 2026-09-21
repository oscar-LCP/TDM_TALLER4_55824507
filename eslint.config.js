import globals from "globals";
import prettier from "eslint-config-prettier";

/**
 * ESLint 9+ usa "flat config": un array donde cada objeto configura un grupo de archivos.
 * Aquí separamos el código de servidor (Node) del código de navegador (browser)
 * porque no comparten las mismas variables globales.
 */
export default [
    // Archivos que ESLint no debe revisar
    {
        ignores: ["node_modules/", "public/css/styles.css"]
    },

    // Código del servidor: corre en Node
    {
        files: ["src/**/*.js", "eslint.config.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: globals.node
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
            eqeqeq: ["warn", "smart"],
            "prefer-const": "warn"
        }
    },

    // Código del cliente: corre en el navegador
    {
        files: ["public/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.serviceworker
            }
        },
        rules: {
            "no-unused-vars": "warn",
            eqeqeq: ["warn", "smart"],
            "prefer-const": "warn"
        }
    },

    // Debe ir al final: apaga las reglas de estilo que chocan con Prettier
    prettier
];