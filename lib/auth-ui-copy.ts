import type { UiLocale } from "./ui-locale";

const copy = {
  es: {
    loginTitle: "Iniciar sesión",
    loginSubtitle: "Accede a tu cuenta de AIKinora",
    adminSubtitle: "Acceso de administrador — panel de gestión",
    email: "Correo electrónico",
    password: "Contraseña",
    enter: "Entrar",
    entering: "Entrando…",
    noAccount: "¿No tienes cuenta?",
    createAccount: "Crear cuenta",
    or: "o",
    forgotPassword: "¿Has olvidado la contraseña?",
    guestCodeTitle: "Código de tu fisioterapeuta",
    guestCodePlaceholder: "Ej. K7M2P9QX",
    guestStart: "Empezar consulta previa",
    guestOpening: "Abriendo consulta…",
    guestCodeRequired: "Introduce el código que te ha dado tu fisioterapeuta.",
    guestStartError: "No se pudo empezar la consulta. Inténtalo de nuevo.",
    forgotTitle: "Restablecer contraseña",
    forgotSubtitle:
      "Escribe el correo de tu cuenta. Si existe, te enviaremos un enlace para crear una nueva contraseña.",
    forgotSend: "Enviar enlace",
    forgotSending: "Enviando…",
    forgotSent:
      "Si hay una cuenta con ese correo, te hemos enviado un enlace. Ábrelo desde tu email para continuar.",
    forgotBack: "Volver al inicio de sesión",
    resetTitle: "Nueva contraseña",
    confirmEmail: "Confirma tu correo",
    confirmEmailHint:
      "Por seguridad, escribe el mismo correo al que te enviamos el enlace. Así comprobamos que eres tú.",
    confirmEmailMismatch: "Ese correo no coincide con el de este enlace.",
    newPassword: "Nueva contraseña",
    confirmPassword: "Repite la contraseña",
    savePassword: "Guardar contraseña",
    savingPassword: "Guardando…",
    passwordMismatch: "Las contraseñas no coinciden.",
    passwordTooShort: "La contraseña debe tener al menos 6 caracteres.",
    resetInvalid:
      "Este enlace no es válido o ha caducado. Solicita uno nuevo desde el inicio de sesión.",
    resetSuccess: "Contraseña actualizada. Ya puedes iniciar sesión.",
    goLogin: "Ir a iniciar sesión",
  },
  en: {
    loginTitle: "Sign in",
    loginSubtitle: "Access your AIKinora account",
    adminSubtitle: "Administrator access — management panel",
    email: "Email",
    password: "Password",
    enter: "Sign in",
    entering: "Signing in…",
    noAccount: "Don't have an account?",
    createAccount: "Create account",
    or: "or",
    forgotPassword: "Forgot your password?",
    guestCodeTitle: "Your physiotherapist's code",
    guestCodePlaceholder: "e.g. K7M2P9QX",
    guestStart: "Start pre-visit consult",
    guestOpening: "Opening consult…",
    guestCodeRequired: "Enter the code your physiotherapist gave you.",
    guestStartError: "Could not start the consult. Please try again.",
    forgotTitle: "Reset password",
    forgotSubtitle:
      "Enter the email for your account. If it exists, we'll send a link to create a new password.",
    forgotSend: "Send link",
    forgotSending: "Sending…",
    forgotSent:
      "If an account exists for that email, we sent a link. Open it from your inbox to continue.",
    forgotBack: "Back to sign in",
    resetTitle: "New password",
    confirmEmail: "Confirm your email",
    confirmEmailHint:
      "For security, type the same email we sent the link to. This confirms it's you.",
    confirmEmailMismatch: "That email doesn't match this reset link.",
    newPassword: "New password",
    confirmPassword: "Repeat password",
    savePassword: "Save password",
    savingPassword: "Saving…",
    passwordMismatch: "Passwords do not match.",
    passwordTooShort: "Password must be at least 6 characters.",
    resetInvalid:
      "This link is invalid or has expired. Request a new one from the sign-in screen.",
    resetSuccess: "Password updated. You can sign in now.",
    goLogin: "Go to sign in",
  },
} as const;

export function authUiCopy(locale: UiLocale) {
  return copy[locale];
}
