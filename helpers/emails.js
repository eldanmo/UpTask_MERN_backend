import nodemailer from 'nodemailer'

export const emailRegistro = async (datos) => {
    const { email, nombre, token } = datos

    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com> ',
        to: email,
        subject: "UpTask - Comprueba tu cuenta",
        text: "Comprueba tú cuenta de UpTask",
        html: `<p> Hola: ${nombre}, comprueba tpu cuenta en UpTask </p>
        <p> Tú cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: </p>

        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>

        <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje</p>
        
        `,
      })
}
export const emailOlvidePassword = async (datos) => {
    const { email, nombre, token } = datos

    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com> ',
        to: email,
        subject: "UpTask - Reestablece tú contraseña",
        text: "Reestablece tú contraseña",
        html: `<p> Hola: ${nombre}, Has solicitado reestablecer tú contraseña </p>
        <p> Sigue este enlace para restablecer tú contraseña: </p>

        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer contraseña</a>

        <p>Si tú no solicitaste restablecer la contraseña, puedes ignorar este mensaje</p>
        
        `,
      })
}