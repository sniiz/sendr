// import { NativeModules, Platform } from "react-native";
import * as Localization from "expo-localization";

// this is a clunky way to localize but while the app is small its not a huge deal
// i think
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
            loading: "attempting to log you in...",
        },
        signUpScreen: {
            barTitle: "sign up",
            title: "sign up for sendr.",
            nicknamePlaceholder: "nickname",
            emailPlaceholder: "email",
            disclaimer:
                "(don't worry - we won't spam you and/or sell your data 👌)",
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
            create: "create",
            chatNamePlaceholder: "chat name here",
        },
        settingsScreen: {
            barTitle: "settings",
            wipText:
                "\nwoops. we're sorry settings are not yet available. we're working on it though!\n\n- yours truly",
            revealInfoButton: "reveal user info for nerds 👀",
            pfp: "profile picture",
            username: "username",
            password: "password",
            logOutButton: "log out 🚪",
            deleteAccountButton: "delete account 🗑",
            logOutConfirm:
                "are you sure you want to log out? (press again to confirm)",
            deleteAccountConfirm:
                "are you absolutely sure you want to delete your account? (press again to confirm)",
            incomplete: ":(\nsadly, this feature is not yet implemented.",
            changeUsername: "change username to",
            changePassword: "change password",
            alreadyNamed: "you're already named",
            oldPassword: "enter your old password",
            wrongPassword: "wrong password, please try again",
            // TODO: settings text
        },
        profileScreen: {
            barTitle: "profile",
            wipText:
                "\nthis section is still under construction. we're working hard on it!\n\n- yours truly",
        },
        chatScreen: {
            inputPlaceholder: "say something...",
        },
        errors: {
            title: "uh oh 😯",
            body: "please forgive me. an error occured",
            report: "report",
            dontReport: "don't report",
            serverTitle: "uh oh 😯",
            serverBody: "our server is unhappy for some reason. we're sorry.",
            serverOk: "ok",
            noChats:
                "oh no! it looks like our server is having some trouble loading your chats. please try again later.\n\n(it will most likely be back at 00:00 PST)",
            serverMoreInfo: "more info",
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
            loading: "chargement...",
        },
        signUpScreen: {
            barTitle: "inscription",
            title: "inscrivez-vous pour sendr.",
            nicknamePlaceholder: "pseudo",
            emailPlaceholder: "email",
            disclaimer:
                "(ne t'inquiète pas - nous ne te spammerons pas et/ou ne vendrons pas tes données 👌)",
            passwordPlaceholder: "mot de passe",
            // pfpPlaceholder: "url de la photo de profil (optionnel)",
            signUpButton: "inscrivez-vous 👉",
        },
        emailVerifyScreen: {
            barTitle: "vérification email",
            title: "il faut confirmer que c'est vraiment votre email.",
            verifyButton: "envoyer un email de vérification 📨",
            didNotReceiveEmail:
                "n'avez-vous pas reçu d'email? cliquez ici pour réenvoyer ✌️",
        },
        newChatScreen: {
            barTitle: "chat nouveau",
            title: "chat nouveau",
            created: "a été créé",
            create: "créer",
            chatNamePlaceholder: "nom du chat ici",
        },
        settingsScreen: {
            barTitle: "paramètres",
            wipText:
                "\noups. nous sommes désolé, les paramètres ne sont pas encore finís. nous'y travaillons dur!\n\n- equipe de sendr",
            revealInfoButton:
                "révéler les infos de l'utilisateur pour les devs 👀",
            pfp: "photo de profil",
            username: "pseudo",
            password: "mot de passe",
            logOutButton: "se déconnecter 🚪",
            deleteAccountButton: "supprimer le compte 🗑",
            logOutConfirm:
                "es-tu sûre de vouloir te déconnecter? (appuie encore pour confirmer)",
            deleteAccountConfirm:
                "es-tu absolument sûr de vouloir supprimer ton compte? (appuie encore pour confirmer)",
            incomplete:
                ":(\nmalheureusement, cette fonctionnalité n'est pas encore implémentée.",
            changeUsername: "changer le pseudo à",
            changePassword: "changer le mot de passe",
            alreadyNamed: "tu es déjà nommé",
            oldPassword: "entre ton ancien mot de passe",
            wrongPassword: "mauvais mot de passe, essaie à nouveau",
        },
        profileScreen: {
            barTitle: "profil",
            wipText:
                "\ncette section est encore en construction. j'y travaille dur!\n\n- equipe de sendr",
        },
        chatScreen: {
            inputPlaceholder: "dis quelque chose...",
        },
        errors: {
            title: "ah non 😯",
            body: "cette erreur est survenue",
            report: "rapport",
            dontReport: "ne pas rapporter",
            serverTitle: "ah non 😯",
            serverBody:
                "notre serveur est déçu pour une raison quelconque. nous sommes désolés.",
            serverOk: "ok",
            noChats:
                "oh non! il semble que notre serveur est triste et ne veut pas charger vos chats.",
            serverMoreInfo: "plus d'info",
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
            loading: "cargando...",
        },
        signUpScreen: {
            barTitle: "registro",
            title: "regístrate para sendr.",
            nicknamePlaceholder: "apodo",
            emailPlaceholder: "email",
            disclaimer:
                "(no te preocupes - no te enviaremos spam ni venderemos tus datos 👌)",
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
            create: "crear",
            chatNamePlaceholder: "nombre del chat aquí",
        },
        settingsScreen: {
            barTitle: "ajustes",
            wipText:
                "\n¡ups! lo siento, la configuración aún no está hecha. ¡estoy trabajando duro en ello!\n\n- equipo de sendr",
            revealInfoButton: "revelar información de usuario para nerds 👀",
            pfp: "foto de perfil",
            username: "apodo",
            password: "contraseña",
            logOutButton: "cerrar sesión 🚪",
            deleteAccountButton: "borrar cuenta 🗑",
            logOutConfirm:
                "¿estás seguro de que quieres cerrar sesión? (presiona de nuevo para confirmar)",
            deleteAccountConfirm:
                "¿estás absolutamente seguro de que quieres borrar tu cuenta? (presiona de nuevo para confirmar)",
            incomplete: ":(\nlo siento, esta función aún no está hecha.",
            changeUsername: "cambiar el apodo a",
            changePassword: "cambiar la contraseña",
            alreadyNamed: "ya estás nombreado",
            oldPassword: "escriba tu antigua contraseña",
            wrongPassword: "contraseña incorrecta, escriba de nuevo",
        },
        profileScreen: {
            barTitle: "perfil",
            wipText:
                "\nesta sección está aún en construcción. ¡estoy trabajando duro en ello!\n\n- equipo de sendr",
        },
        chatScreen: {
            inputPlaceholder: "escribe algo...",
        },
        errors: {
            title: "ah no 😯",
            body: "¡oh, no! ocurrió este error: ",
            report: "informar a la desarrolladorar",
            dontReport: "no informar",
            serverTitle: "ah no 😯",
            serverBody:
                "nuestro servidor está enfadado por alguna razón. ¡nos disculpamos!",
            serverOk: "ok",
            noChats:
                "¡oh no! parece que nuestro servidor está triste y no puede cargar tus chats.",
            serverMoreInfo: "más información",
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
            loading: "загрузка...",
        },
        signUpScreen: {
            barTitle: "создать аккаунт",
            title: "новый аккаунт sendr.",
            nicknamePlaceholder: "никнейм",
            emailPlaceholder: "email",
            disclaimer:
                "(не волнуйся - мы не будем тебе спамить и/или продавать твои данные рекламщикам 👌)",
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
            create: "создать",
            chatNamePlaceholder: "сюда название чата",
        },
        settingsScreen: {
            barTitle: "настройки",
            wipText:
                "\nой. прости пожалуйста, настройки пока еще не закончены. мы очень усердно над ними работаем!\n\n- команда sendr",
            revealInfoButton: "показать инфо о профиле для разрабов 👀",
            pfp: "картинка профиля",
            username: "никнейм",
            password: "пароль",
            logOutButton: "выйти 🚪",
            deleteAccountButton: "удалить аккаунт 🗑",
            logOutConfirm:
                "ты уверен, что хочешь выйти? (нажми еще раз, чтобы подтвердить)",
            deleteAccountConfirm:
                "ты уверен, что хочешь удалить аккаунт? (нажми еще раз, чтобы подтвердить)",
            incomplete: ":(\nпрости, эта функция пока еще не закончена.",
            changeUsername: "изменить никнейм на",
            changePassword: "изменить пароль",
            alreadyNamed: "тебя уже зовут",
            oldPassword: "введи свой старый пароль",
            wrongPassword: "неверный пароль, попробуй еще раз",
        },
        profileScreen: {
            barTitle: "профиль",
            wipText:
                "\nой. эти настройки пока еще не зкончены. мы очень усердно над ними работаем!\n\n- команда sendr",
        },
        chatScreen: {
            inputPlaceholder: "напиши что-нибудь...",
        },
        errors: {
            title: "о нет 😯",
            body: "какая досада, произошла ошибка:",
            report: "сообщить разработчику",
            dontReport: "не сообщать",
            serverTitle: "о нет 😯",
            serverBody: "наш сервер обиделся. прости пожалуйста.",
            serverOk: "ок",
            noChats:
                "ой. похоже, наш сервер обиделся, и не может загрузить твои чаты.",
            serverMoreInfo: "подробнее",
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
            loading: "加载中...",
        },
        signUpScreen: {
            barTitle: "报名",
            title: "创建新的sendr.账户",
            nicknamePlaceholder: "昵称",
            emailPlaceholder: "电子邮件",
            disclaimer:
                "(别担心--我们不会向你发送垃圾邮件和/或将你的数据卖给广告商 👌)",
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
            create: "创建",
            chatNamePlaceholder: "聊天名称",
        },
        settingsScreen: {
            barTitle: "设置",
            wipText:
                "\n哎呀。 非常抱歉，这些设置尚不可用。 不过，我正在努力研究它们!\n\n- sendr的海利",
            revealInfoButton: "显示个人信息 👀",
            pfp: "头像",
            username: "用户名",
            password: "密码",
            logOutButton: "登出 🚪",
            deleteAccountButton: "删除账户 🗑",
            logOutConfirm: "你确定要登出吗? (点击一次确认)",
            deleteAccountConfirm: "你确定要删除账户吗? (点击一次确认)",
            incomplete: ":(\n这个功能还没有完成.",
            changeUsername: "改变用户名为",
            changePassword: "改变密码",
            alreadyNamed: "你已经叫",
            oldPassword: "输入你的旧密码",
            wrongPassword: "密码错误，请再试一次",
        },
        profileScreen: {
            barTitle: "个人资料",
            wipText:
                "\n哎呀。 这些设置尚不可用。 不过，我正在努力研究它们!\n\n- sendr的海利",
            revealInfoButton: "显示个人资料给开发者 👀",
        },
        chatScreen: {
            inputPlaceholder: "输入消息...",
        },
        errors: {
            title: "哎呀 😯",
            body: "哎呀，出错了:",
            report: "向开发者报告",
            dontReport: "不要报告",
            serverTitle: "哎呀 😯",
            serverBody: "我们的服务器出错了。 对不起!",
            serverOk: "好的",

            noChats: "哎呀。 我们的服务器出错了，无法获取你的聊天。",
            serverMoreInfo: "更多信息",
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
            loading: "ロード中...",
        },
        signUpScreen: {
            barTitle: "サインアップ",
            title: "新しいセーンダアカウントを作成",
            nicknamePlaceholder: "ニックネーム",
            emailPlaceholder: "メールアドレス",
            disclaimer:
                "(ご心配なく - メールスパムや広告主にお客様のデータを販売することはありません 👌)",
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
            create: "作成",
            chatNamePlaceholder: "チャット名",
        },
        settingsScreen: {
            barTitle: "設定",
            wipText:
                "\nええとああ。 設定はまだ利用できません。 頑張っています！\n\n- セーンダのヘイリー",
            revealInfoButton: "プロフィールを表示 👀",
            pfp: "プロフィール写真",
            username: "ユーザー名",
            password: "パスワード",
            logOutButton: "ログアウト 🚪",
            deleteAccountButton: "アカウントを削除 🗑",
            logOutConfirm: "ログアウトしますか？ (一度クリックして確認)",
            deleteAccountConfirm:
                "アカウントを削除しますか？ (一度クリックして確認)",
            incomplete: ":(\nこの機能はまだ完成していません.",
            changeUsername: "ユーザー名を変更する",
            changePassword: "パスワードを変更する",
            alreadyNamed: "あなたは",
            oldPassword: "旧パスワードを入力してください",
            wrongPassword: "パスワードが間違っています。 再度お試しください",
        },
        profileScreen: {
            barTitle: "プロフィール",
            wipText:
                "\nええとああ。 設定はまだ利用できません。 頑張っています！\n\n- セーンダのヘイリー",
            revealInfoButton: "開示するプロフィール経歴を開示する 👀",
        },
        chatScreen: {
            inputPlaceholder: "メッセージを入力...",
        },
        errors: {
            title: "ああ (つω`｡)",
            body: "大野！ エラーが発生しました：",
            report: "開発者に報告",
            dontReport: "報告しない",
            serverTitle: "ああ (つω`｡)",
            serverBody: "サーバーにエラーが発生しました。 ごめんなさい!",
            serverOk: "OK",
            noChats:
                "大野！ サーバーにエラーが発生しました。 チャットを取得できません。",
            serverMoreInfo: "詳細情報",
        },
    },
};

const supported = ["en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja"]; // terrible way to do this but nothing else worked

// wowee what a mess

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
// console.log(lang);

export default UIText;
