import { NativeModules, Platform } from "react-native";

const uiText = {
    en: {
        loginScreen: {
            barTitle: "login",
            title: "sendr.",
            emailPlaceholder: "email here",
            passwordPlaceholder: "password here",
            passwordError: "wrong password, please try again",
            loginButton: "log in 👉",
            signUpButton: "no account? sign up 👋",
        },
        signUpScreen: {
            barTitle: "sign up",
            title: "sign up for sendr.",
            nicknamePlaceholder: "nickname",
            emailPlaceholder: "email",
            passwordPlaceholder: "password",
            // pfpPlaceholder: "profile picture url (optional)",
            signUpButton: "sign up 👉",
        },
        newChatScreen: {
            barTitle: "new chat",
            title: "new chat",
            chatNamePlaceholder: "chat name here",
        },
        settingsScreen: {
            barTitle: "settings",
            wipText:
                "\nwoops. i'm sorry settings are not yet available. i'm working on it though!\n\n- yours truly",
            // TODO: settings text
        },
        profileScreen: {
            barTitle: "profile",
            wipText:
                "\nthis section is still under construction. i'm working hard on it!\n\n- yours truly",
        },
    },
    fr: {
        loginScreen: {
            barTitle: "connexion",
            title: "sendr.",
            emailPlaceholder: "email ici",
            passwordPlaceholder: "mot de passe ici",
            passwordError: "mot de passe incorrect",
            loginButton: "se connecter 👉",
            signUpButton: "pas encore inscrit? inscrivez-vous 👋",
        },
        signUpScreen: {
            barTitle: "inscription",
            title: "inscrivez-vous pour sendr.",
            nicknamePlaceholder: "pseudo",
            emailPlaceholder: "email",
            passwordPlaceholder: "mot de passe",
            // pfpPlaceholder: "url de la photo de profil (optionnel)",
            signUpButton: "inscrivez-vous 👉",
        },
        newChatScreen: {
            barTitle: "chat nouveau",
            title: "chat nouveau",
            chatNamePlaceholder: "nom du chat ici",
        },
        settingsScreen: {
            barTitle: "paramètres",
            wipText:
                "\noups. je suis désolé, les paramètres ne sont pas encore finís. j'y travaille dur!\n\n- haley de sendr",
        },
        profileScreen: {
            barTitle: "profil",
            wipText:
                "\ncette section est encore en construction. j'y travaille dur!\n\n- haley de sendr",
        },
    },
    es: {
        loginScreen: {
            barTitle: "iniciar sesión",
            title: "sendr.",
            emailPlaceholder: "email aquí",
            passwordPlaceholder: "contraseña aquí",
            passwordError: "contraseña incorrecta",
            loginButton: "iniciar sesión 👉",
            signUpButton: "¿no tienes cuenta? ¡regístrate 👋",
        },
        signUpScreen: {
            barTitle: "registro",
            title: "regístrate para sendr.",
            nicknamePlaceholder: "apodo",
            emailPlaceholder: "email",
            passwordPlaceholder: "contraseña",
            // pfpPlaceholder: "url de la imagenn de perfil (opcional)",
            signUpButton: "regístrate 👉",
        },
        newChatScreen: {
            barTitle: "nuevo chat",
            title: "nuevo chat",
            chatNamePlaceholder: "nombre del chat aquí",
        },
        settingsScreen: {
            barTitle: "ajustes",
            wipText:
                "\n¡ups! lo siento, la configuración aún no está hecha. ¡estoy trabajando duro en ello!\n\n- haley de sendr",
        },
        profileScreen: {
            barTitle: "perfil",
            wipText:
                "\nesta sección está aún en construcción. ¡estoy trabajando duro en ello!\n\n- haley de sendr",
        },
    },
    ru: {
        loginScreen: {
            barTitle: "вход",
            title: "sendr.",
            emailPlaceholder: "сюда email",
            passwordPlaceholder: "сюда пароль",
            passwordError: "неверный пароль, попробуй еще раз",
            loginButton: "войти 👉",
            signUpButton: "нет аккаунта? зарегистрируйся 👋",
        },
        signUpScreen: {
            barTitle: "создать аккаунт",
            title: "новый аккаунт sendr.",
            nicknamePlaceholder: "никнейм",
            emailPlaceholder: "email",
            passwordPlaceholder: "пароль",
            // pfpPlaceholder: "url картинки на профиль (необязательно)",
            signUpButton: "создать 👉",
        },
        newChatScreen: {
            barTitle: "новый чат",
            title: "новый чат",
            chatNamePlaceholder: "сюда название чата",
        },
        settingsScreen: {
            barTitle: "настройки",
            wipText:
                "\nой. прости пожалуйста, настройки пока еще не закончены. я очень усердно над ними работаю!\n\n- хейли",
        },
        profileScreen: {
            barTitle: "профиль",
            wipText:
                "\nой. эти настройки пока еще не зкончены. я очень усердно над ними работаю!\n\n- хейли",
        },
    },
    zh: {
        loginScreen: {
            barTitle: "登录",
            title: "sendr.",
            emailPlaceholder: "电子邮件",
            passwordPlaceholder: "密码",
            passwordError: "密码错误",
            loginButton: "登录 👉",
            signUpButton: "没有账户? 创建新的 👋",
        },
        signUpScreen: {
            barTitle: "报名",
            title: "创建新的sendr.账户",
            nicknamePlaceholder: "昵称",
            emailPlaceholder: "电子邮件",
            passwordPlaceholder: "密码",
            // pfpPlaceholder: "头像网址 (可选的)",
            signUpButton: "报名 👉",
        },
        newChatScreen: {
            barTitle: "新建聊天",
            title: "新建聊天",
            chatNamePlaceholder: "聊天名称",
        },
        settingsScreen: {
            barTitle: "设置",
            wipText:
                "\n哎呀。 非常抱歉，这些设置尚不可用。 不过，我正在努力研究它们!\n\n- sendr的海利",
        },
        profileScreen: {
            barTitle: "个人资料",
            wipText:
                "\n哎呀。 这些设置尚不可用。 不过，我正在努力研究它们!\n\n- sendr的海利",
        },
    },
    ja: {
        loginScreen: {
            barTitle: "ログイン",
            title: "セーンダ.",
            emailPlaceholder: "メールアドレス",
            passwordPlaceholder: "パスワード",
            passwordError: "パスワードが間違っています",
            loginButton: "ログイン 👉",
            signUpButton: "アカウントがありませんか？ サインアップ 👋",
        },
        signUpScreen: {
            barTitle: "サインアップ",
            title: "新しいセーンダアカウントを作成",
            nicknamePlaceholder: "ニックネーム",
            emailPlaceholder: "メールアドレス",
            passwordPlaceholder: "パスワード",
            // pfpPlaceholder: "プロフィール写真のurl (随意)",
            signUpButton: "サインアップ 👉",
        },
        newChatScreen: {
            barTitle: "新しいチャット",
            title: "新しいチャット",
            chatNamePlaceholder: "チャット名",
        },
        settingsScreen: {
            barTitle: "設定",
            wipText:
                "\nええとああ。 設定はまだ利用できません。 頑張っています！\n\n- セーンダのヘイリー",
        },
        profileScreen: {
            barTitle: "プロフィール",
            wipText:
                "\nええとああ。 設定はまだ利用できません。 頑張っています！\n\n- セーンダのヘイリー",
        },
    },
};

const supported = ["en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja"]; // terrible way to do this but nothing else worked

// if (RNLocalize.getLocales()[0].languageCode in uiText) {
//     export default uiText[RNLocalize.getLocales()[0].languageCode];
// } else {
//     export default uiText.en;

if (Platform.OS === "ios") {
    var lang =
        NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0];
    lang = lang.slice(0, 2);
    // console.log("ios lang: " + lang);
    if (!supported.includes(lang)) {
        lang = "en";
    }
} else if (Platform.OS === "android") {
    var lang = NativeModules.SettingsManager.settings.language;
    lang = lang.slice(0, 2);
    if (!supported.includes(lang)) {
        lang = "en";
    }
} else {
    var lang = "en"; // TODO figure out how to get this on web/desktop
}

var UIText = uiText[lang];
console.log(lang);

export default UIText;
