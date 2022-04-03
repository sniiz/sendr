// import { NativeModules, Platform } from "react-native";
import * as Localization from "expo-localization";

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
        emailVerifyScreen: {
            barTitle: "email verification",
            title: "we need to confirm that this email is yours.",
            verifyButton: "send verification email 📨",
            didNotReceiveEmail:
                "did not receive email? tap the button again to resend ✌️",
        },
        newChatScreen: {
            barTitle: "new chat",
            title: "new chat",
            created: "created",
            chatNamePlaceholder: "chat name here",
        },
        settingsScreen: {
            barTitle: "settings",
            wipText:
                "\nwoops. we're sorry settings are not yet available. we're working on it though!\n\n- yours truly",
            revealInfoButton: "reveal user info for nerds 👀",
            // TODO: settings text
        },
        profileScreen: {
            barTitle: "profile",
            wipText:
                "\nthis section is still under construction. we're working hard on it!\n\n- yours truly",
        },

        errors: {
            title: "uh oh 😯",
            body: "please forgive me. an error occured",
            report: "report",
            dontReport: "don't report",
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
        emailVerifyScreen: {
            barTitle: "vérification email",
            title: "il faut confirmer que c'est vraiment votre email.",
            verifyButton: "envoyer un email de vérification 📨",
            didNotReceiveEmail:
                "n'avez-vous pas reçu d'email? cliquez de nouveau pour réenvoyer ✌️",
        },
        newChatScreen: {
            barTitle: "chat nouveau",
            title: "chat nouveau",
            created: "a été créé",
            chatNamePlaceholder: "nom du chat ici",
        },
        settingsScreen: {
            barTitle: "paramètres",
            wipText:
                "\noups. je suis désolé, les paramètres ne sont pas encore finís. j'y travaille dur!\n\n- equipe de sendr",
            revealInfoButton: "révéler les infos utilisateur pour les devs 👀",
        },
        profileScreen: {
            barTitle: "profil",
            wipText:
                "\ncette section est encore en construction. j'y travaille dur!\n\n- equipe de sendr",
        },
        errors: {
            title: "ah non 😯",
            body: "cette erreur est survenue",
            report: "rapport",
            dontReport: "ne pas rapporter",
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
        emailVerifyScreen: {
            barTitle: "verificación de email",
            title: "necesitamos confirmar que ese email es tuyo.",
            verifyButton: "enviar email de verificación 📨",
            didNotReceiveEmail:
                "¿no has recibido el email? haz click de nuevo para reenviar ✌️",
        },
        newChatScreen: {
            barTitle: "nuevo chat",
            title: "nuevo chat",
            created: "se ha creado el",
            chatNamePlaceholder: "nombre del chat aquí",
        },
        settingsScreen: {
            barTitle: "ajustes",
            wipText:
                "\n¡ups! lo siento, la configuración aún no está hecha. ¡estoy trabajando duro en ello!\n\n- equipo de sendr",
            revealInfoButton: "revelar información de usuario para nerds 👀",
        },
        profileScreen: {
            barTitle: "perfil",
            wipText:
                "\nesta sección está aún en construcción. ¡estoy trabajando duro en ello!\n\n- equipo de sendr",
        },
        errors: {
            title: "ah no 😯",
            body: "¡oh, no! ocurrió este error: ",
            report: "informar a la desarrolladorar",
            dontReport: "no informar",
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
        emailVerifyScreen: {
            barTitle: "подтверждение почты",
            title: "нам нужно подтвердить, что это почта принадлежит тебе.",
            verifyButton: "отправить письмо подтверждения 📨",
            didNotReceiveEmail:
                "не получили письмо? нажми еще раз, чтобы отправить заново ✌️",
        },
        newChatScreen: {
            barTitle: "новый чат",
            title: "новый чат",
            created: "был создан",
            chatNamePlaceholder: "сюда название чата",
        },
        settingsScreen: {
            barTitle: "настройки",
            wipText:
                "\nой. прости пожалуйста, настройки пока еще не закончены. мы очень усердно над ними работаем!\n\n- команда sendr",
            revealInfoButton: "показать инфо о профиле для разрабов 👀",
        },
        profileScreen: {
            barTitle: "профиль",
            wipText:
                "\nой. эти настройки пока еще не зкончены. мы очень усердно над ними работаем!\n\n- команда sendr",
        },
        errors: {
            title: "о нет 😯",
            body: "какая досада, произошла ошибка:",
            report: "сообщить разработчику",
            dontReport: "не сообщать",
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
        emailVerifyScreen: {
            barTitle: "邮箱验证",
            title: "我们需要验证这个电子邮件是你的.",
            verifyButton: "发送验证邮件 📨",
            didNotReceiveEmail: "没有收到邮件? 点击重新发送 ✌️",
        },
        newChatScreen: {
            barTitle: "新建聊天",
            title: "新建聊天",
            created: "已创建",
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
            revealInfoButton: "显示个人资料给开发者 👀",
        },
        errors: {
            title: "哎呀 😯",
            body: "哎呀，出错了:",
            report: "向开发者报告",
            dontReport: "不要报告",
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
        emailVerifyScreen: {
            barTitle: "メール確認",
            title: "このメールアドレスはあなたのものですか？",
            verifyButton: "メールを確認する 📨",
            didNotReceiveEmail: "メールが届いていませんか？ メールを再送信 ✌️",
        },
        newChatScreen: {
            barTitle: "新しいチャット",
            title: "新しいチャット",
            created: "作成されました",
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
            revealInfoButton: "開示するプロフィール経歴を開示する 👀",
        },
        errors: {
            title: "ああ (つω`｡)",
            body: "大野！ エラーが発生しました：",
            report: "開発者に報告",
            dontReport: "報告しない",
        },
    },
};

const supported = ["en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja"]; // terrible way to do this but nothing else worked

// if (RNLocalize.getLocales()[0].languageCode in uiText) {
//     export default uiText[RNLocalize.getLocales()[0].languageCode];
// } else {
//     export default uiText.en;

// if (Platform.OS === "ios") {
//     var lang =
//         NativeModules.SettingsManager.settings.AppleLocale ||
//         NativeModules.SettingsManager.settings.AppleLanguages[0];
//     lang = lang.slice(0, 2);
//     // console.log("ios lang: " + lang);
//     if (!supported.includes(lang)) {
//         lang = "en";
//     }
// } else if (Platform.OS === "android") {
//     var lang = NativeModules.SettingsManager.settings.language;
//     lang = lang.slice(0, 2);
//     if (!supported.includes(lang)) {
//         lang = "en";
//     }
// } else {
//     var lang = "en";
// }

var lang = Localization.locale.substring(0, 2);
if (!supported.includes(lang)) {
    lang = "en";
}

var UIText = uiText[lang];
console.log(lang);

export default UIText;
