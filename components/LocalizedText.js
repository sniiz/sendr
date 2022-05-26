// import { NativeModules, Platform } from "react-native";
import * as Localization from "expo-localization";

// this is a clunky way to localize but while the app is small its not a huge deal
// i think

// (0.1.9) nevermind
// TODO better localization
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
      disclaimer: "(don't worry - we won't spam you and/or sell your data 👌)",
      passwordPlaceholder: "password",
      signUpButton: "sign up 👉",
      taken: "this nickname is already taken. please think of something else",
    },
    emailVerifyScreen: {
      barTitle: "email verification",
      title: "we need to confirm that this email is yours.",
      verifyButton: "send verification email 📨",
      sentButton: "sent! check your inbox 📧",
      errorButton: "email verification failed, please try again",
      didNotReceiveEmail:
        "did not receive the email? tap the button again to resend ✌️",
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
      logOutButton: "log out 👉🚪",
      deleteAccountButton: "delete account 🗑",
      logOutConfirm:
        "are you sure you want to log out? (press again to confirm)",
      deleteAccountConfirm:
        "are you absolutely sure you want to delete your account? (press again to confirm)",
      incomplete: ":(\nsadly, this feature is not yet implemented.",
      changeUsername: "change username to",
      changePassword: "change password",
      alreadyNamed: "you're already named",
      usernameTooLong: "is too long! please keep it under 15 characters.",
      oldPassword: "enter your old password",
      wrongPassword: "wrong password, please try again",
      pfpChange: "click to change",
    },
    profileScreen: {
      barTitle: "profile",
      wipText:
        "\nthis section is still under construction. we're working hard on it!\n\n- yours truly",
    },
    chatScreen: {
      inputPlaceholder: "say something...",
      send: "send",
      sending: "sending...",
      showUid: "show uid",
      hideUid: "hide uid",
      saysth: "there are no messages yet. say hi!",
      created: " created ",
      tooLong:
        "your message is very long! please try to make it less than 1000 characters.",
    },
    homeScreen: {
      lonely1: "so lonely here...",
      lonely2: "so silent...",
      lonely3: "so quiet...",
      lonely4: "there's nothing here...",
      lonely5: "so empty...",
      lonely6: "where did everyone go?",
      lonely7: "there's only you here...",
      github: "sendr on github!",
      friends: "friends",
      newChat: "create chat",
      settings: "settings",
    },
    friendsScreen: {
      barTitle: "friends",
    },
    errors: {
      title: "uh oh 😯",
      body: "please forgive us. an error occured",
      report: "report",
      dontReport: "don't report",
      serverTitle: "uh oh 😯",
      serverBody: "our server is unhappy for some reason. we're sorry.",
      serverOk: "ok",
      noChats:
        "oh no! it looks like our server is having some trouble loading your chats. please try again later.\n\n(it will most likely be back at 00:00 PST)",
      serverMoreInfo: "more info",
    },
    gandalf: "gandalf",
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
      signUpButton: "inscrivez-vous 👉",
      taken: "ce pseudo est déjà pris. essaye un autre",
    },
    emailVerifyScreen: {
      barTitle: "vérification email",
      title: "il faut confirmer que c'est vraiment votre email.",
      verifyButton: "envoyer un email de vérification 📨",
      sentButton: "envoyé! regarde dans ton boîte mail 📧",
      errorButton: "erreur de vérification email, veuillez réessayer",
      didNotReceiveEmail:
        "n'as-tu pas reçu d'email? cliques ici pour réenvoyer ✌️",
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
      revealInfoButton: "révéler les infos de l'utilisateur pour les devs 👀",
      pfp: "photo de profil",
      username: "pseudo",
      password: "mot de passe",
      logOutButton: "se déconnecter 👉🚪",
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
      usernameTooLong: "est trop long! veuilles garder-le sous 15 lettres.",
      oldPassword: "entre ton ancien mot de passe",
      wrongPassword: "mauvais mot de passe, essaie à nouveau",
      pfpChange: "clique pour changer",
    },
    profileScreen: {
      barTitle: "profil",
      wipText:
        "\ncette section est encore en construction. nous'y travaillons dur!\n\n- equipe de sendr",
    },
    chatScreen: {
      inputPlaceholder: "dis quelque chose...",
      send: "envoyer",
      sending: "envoi...",
      showUid: "montrer l'uid",
      hideUid: "cacher l'uid",
      created: " a créé ",
      saysth: "il n'y a pas encore de messages. dis bonjour!",
      tooLong:
        "ton message est trop long! veuilles garder-le sous 1000 lettres.",
    },
    homeScreen: {
      lonely1: "ça y est tout seul ici...",
      lonely2: "ça y est tout seul...",
      lonely3: "il n'y a pas un son...",
      lonely4: "il n'y a rien ici...",
      lonely5: "ça y est tout seul...",
      lonely6: "où est-ce que tout le monde est parti?",
      lonely7: "il n'y a que toi ici...",
      github: "sendr sur github!",
      friends: "amis",
      newChat: "créer chat",
      settings: "paramètres",
    },
    friendsScreen: {
      barTitle: "amis",
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
    gandalf: "gandalf",
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
      signUpButton: "regístrate 👉",
      taken: "ese apodo ya está en uso. prueba otro",
    },
    emailVerifyScreen: {
      barTitle: "verificación de email",
      title: "necesitamos confirmar que ese email es tuyo.",
      verifyButton: "enviar email de verificación 📨",
      sentButton: "enviado! revisa tu bandeja de entrada 📧",
      errorButton: "error de verificación de email, intenta de nuevo",
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
      logOutButton: "cerrar sesión 👉🚪",
      deleteAccountButton: "borrar cuenta 🗑",
      logOutConfirm:
        "¿estás seguro de que quieres cerrar sesión? (presiona de nuevo para confirmar)",
      deleteAccountConfirm:
        "¿estás absolutamente seguro de que quieres borrar tu cuenta? (presiona de nuevo para confirmar)",
      incomplete: ":(\nlo siento, esta función aún no está hecha.",
      changeUsername: "cambiar el apodo a",
      changePassword: "cambiar la contraseña",
      alreadyNamed: "ya estás nombreado",
      usernameTooLong: "es muy largo! manténlo bajo 15 letras.",
      oldPassword: "escriba tu antigua contraseña",
      wrongPassword: "contraseña incorrecta, escriba de nuevo",
      pfpChange: "clic para cambiar",
    },
    profileScreen: {
      barTitle: "perfil",
      wipText:
        "\nesta sección está aún en construcción. ¡estoy trabajando duro en ello!\n\n- equipo de sendr",
    },
    chatScreen: {
      inputPlaceholder: "escribe algo...",
      send: "enviar",
      sending: "enviando...",
      showUid: "mostrar uid",
      hideUid: "ocultar uid",
      created: " creó ",
      saysth: "no hay mensajes todavía. ¡di hola!",
      tooLong: "tu mensaje es demasiado largo! manténlo bajo 1000 letras.",
    },
    homeScreen: {
      lonely1: "se está tan solo aquí...",
      lonely2: "es tan silencioso aquí...",
      lonely3: "no hay sonido...",
      lonely4: "tan vacío...",
      lonely5: "es tan solo aquí...",
      lonely6: "¿dónde está todo el mundo?",
      lonely7: "es tan solo aquí...",
      github: "sendr en github!",
      friends: "amigos",
      newChat: "crear chat",
      settings: "ajustes",
    },
    friendsScreen: {
      barTitle: "amigos",
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
    gandalf: "gandalf",
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
      signUpButton: "создать 👉",
      taken: "этот никнейм уже занят. придумай какой-нибудь еще",
    },
    emailVerifyScreen: {
      barTitle: "подтверждение почты",
      title: "нам нужно подтвердить, что это почта принадлежит тебе.",
      verifyButton: "отправить письмо подтверждения 📨",
      sentButton: "отправлено! проверь свою почту 📧",
      errorButton: "ошибка подтверждения почты, попробуй еще раз",
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
      logOutButton: "выйти 👉🚪",
      deleteAccountButton: "удалить аккаунт 🗑",
      logOutConfirm:
        "ты уверен, что хочешь выйти? (нажми еще раз, чтобы подтвердить)",
      deleteAccountConfirm:
        "ты уверен, что хочешь удалить аккаунт? (нажми еще раз, чтобы подтвердить)",
      incomplete: ":(\nпрости, эта функция пока еще не закончена.",
      changeUsername: "изменить никнейм на",
      changePassword: "изменить пароль",
      alreadyNamed: "тебя уже зовут",
      usernameTooLong: "слишком длинно! пожалуйста сделай его покороче.",
      oldPassword: "введи свой старый пароль",
      wrongPassword: "неверный пароль, попробуй еще раз",
      pfpChange: "кликни чтобы поменять",
    },
    profileScreen: {
      barTitle: "профиль",
      wipText:
        "\nой. эти настройки пока еще не зкончены. мы очень усердно над ними работаем!\n\n- команда sendr",
    },
    chatScreen: {
      inputPlaceholder: "напиши что-нибудь...",
      send: "отправить",
      sending: "отправляется...",
      showUid: "показать uid",
      hideUid: "скрыть uid",
      created: " создал(а) ",
      saysth: "здесь пока тихо. скажи привет!",
      tooLong:
        "твое сообщение слишком длинное! пожалуйста сделай его короче 1000 символов.",
    },
    homeScreen: {
      lonely1: "здесь так одиноко...",
      lonely2: "так тихо...",
      lonely3: "здесь ни звука...",
      lonely4: "здесь пусто...",
      lonely5: "здесь ничего нет...",
      lonely6: "куда все делись..?",
      lonely7: "здесь только ты...",
      github: "sendr на github'е!",
      friends: "друзья",
      newChat: "новый чат",
      settings: "настройки",
    },
    friendsScreen: {
      barTitle: "друзья",
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
    gandalf: "гендальф",
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
      signUpButton: "报名 👉",
      taken: "这个昵称已经被使用了",
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
      logOutButton: "登出 👉🚪",
      deleteAccountButton: "删除账户 🗑",
      logOutConfirm: "你确定要登出吗? (点击一次确认)",
      deleteAccountConfirm: "你确定要删除账户吗? (点击一次确认)",
      incomplete: ":(\n这个功能还没有完成.",
      changeUsername: "改变用户名为",
      changePassword: "改变密码",
      alreadyNamed: "你已经叫",
      usernameTooLong: "太长了！ 请将你的名字缩短",
      oldPassword: "输入你的旧密码",
      wrongPassword: "密码错误，请再试一次",
      pfpChange: "点击改变",
    },
    profileScreen: {
      barTitle: "个人资料",
      wipText:
        "\n哎呀。 这些设置尚不可用。 不过，我正在努力研究它们!\n\n- sendr的海利",
      revealInfoButton: "显示个人资料给开发者 👀",
    },
    chatScreen: {
      inputPlaceholder: "输入消息...",
      send: "发送",
      sending: "发送中...",
      showUid: "显示 UID",
      hideUid: "隐藏 UID",
      created: "创建了",
      saysth: "这里没有留言。说你好吧!",
      tooLong: "太长了！",
    },
    homeScreen: {
      lonely1: "这里什么都没有...",
      lonely2: "这里什么都没有...",
      lonely3: "这里什么都没有...",
      lonely4: "这里什么都没有...",
      lonely5: "这里什么都没有...",
      lonely6: "这里什么都没有...",
      lonely7: "这里什么都没有...",
      github: "sendr on github!",
      friends: "好友",
      newChat: "新建聊天",
      settings: "设置",
    },
    friendsScreen: {
      barTitle: "好友",
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
    gandalf: "甘道夫",
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
      signUpButton: "サインアップ 👉",
      taken:
        "このユーザーネームはすでに使用されていますので、他のユーザーネームを考えてください。",
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
      logOutButton: "ログアウト 👉🚪",
      deleteAccountButton: "アカウントを削除 🗑",
      logOutConfirm: "ログアウトしますか？ (一度クリックして確認)",
      deleteAccountConfirm: "アカウントを削除しますか？ (一度クリックして確認)",
      incomplete: ":(\nこの機能はまだ完成していません.",
      changeUsername: "ユーザー名を変更する",
      changePassword: "パスワードを変更する",
      alreadyNamed: "あなたは",
      usernameTooLong: "長すぎます！ ユーザー名を短くしてください",
      oldPassword: "旧パスワードを入力してください",
      wrongPassword: "パスワードが間違っています。 再度お試しください",
      pfpChange: "クリックで変更",
    },
    profileScreen: {
      barTitle: "プロフィール",
      wipText:
        "\nええとああ。 設定はまだ利用できません。 頑張っています！\n\n- セーンダのヘイリー",
      revealInfoButton: "開示するプロフィール経歴を開示する 👀",
    },
    chatScreen: {
      inputPlaceholder: "メッセージを入力...",
      send: "おくる",
      sending: "送信...",
      showUid: "UIDを表示する",
      hideUid: "UIDを隠す",
      created: " created ",
      saysth: "ここにメッセージはありません。",
      tooLong: "あなたのメッセージは長すぎます。",
    },
    homeScreen: {
      lonely1: "ここに何もない...",
      lonely2: "ここに何もない...",
      lonely3: "ここに何もない...",
      lonely4: "ここに何もない...",
      lonely5: "ここに何もない...",
      lonely6: "ここに何もない...",
      lonely7: "ここに何もない...",
      github: "sendr on github!",
      friends: "友達",
      newChat: "新しいチャット",
      settings: "設定",
    },
    friendsScreen: {
      barTitle: "友達",
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
    gandalf: "ガンダルフ",
  },
};

const supported = ["en", "es", "fr", "ru", "zh", "ja"]; // terrible way to do this but nothing else worked

var lang = Localization.locale.substring(0, 2);
if (!uiText.hasOwnProperty(lang)) {
  lang = "en";
}

// HMM I WONDER WHAT THIS COULD BE
if (new Date().getDate() === 25 && new Date().getMonth() === 4) {
  const emojis =
    /((\ud83c[\udde6-\uddff]){2}|([\#\*0-9]\u20e3)|(\u00a9|\u00ae|[\u2000-\u3300]|[\ud83c-\ud83e][\ud000-\udfff])((\ud83c[\udffb-\udfff])?(\ud83e[\uddb0-\uddb3])?(\ufe0f?\u200d([\u2000-\u3300]|[\ud83c-\ud83e][\ud000-\udfff])\ufe0f?)?)*)/g;
  for (var key in uiText[lang]) {
    if (key !== "gandalf") {
      for (var key2 in uiText[lang][key]) {
        var text = uiText[lang][key][key2];
        var split = text.split(" ");
        for (var i = 0; i < split.length; i++) {
          if (split[i].length > 1 && !split[i].match(emojis)) {
            split[i] = uiText[lang].gandalf;
          }
        }
        uiText[lang][key][key2] = split.join(" ");
      }
    }
  }
}
var UIText = uiText[lang];
// console.log(lang);

export default UIText;
