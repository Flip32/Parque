import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

exports.novoAviso = functions.firestore
    .document('avisos/{avisosID}')
    .onCreate(async event => {

        const data = event.data() as any;
        const titulo = data.titulo;
        const conteudo = data.conteudo;

        // Mensagem
        const payload = {
            notification: {
                title: `${titulo}`,
                body: `Novo Aviso: ${conteudo}`
            }
        }

        // Referencias dos usuarios inscritos
        const db = admin.firestore()
        const devicesRef = db.collection('devices')

        // Pegar os tokens e enviar a notificação
        const devices = await devicesRef.get();

        const tokens = [] as any;

        // loop
        devices.forEach(result => {
            const token = result.data().token;

            tokens.push(token)
        })

        // enviar a notificação para cada usuario cadastrado

        return admin.messaging().sendToDevice(tokens, payload)

    });

exports.novoEvento = functions.firestore
    .document('eventos/{eventosID}')
    .onCreate(async event => {

        const data = event.data() as any;
        const titulo = data.titulo;
        const descricao = data.descricao;
        const url = data.url;

        // Mensagem
        const payload = {
            notification: {
                title: `${titulo}`,
                body: `Novo Evento: ${descricao}`,
                image: `${url}`
            }
        }

        // Referencias dos usuarios inscritos
        const db = admin.firestore()
        const devicesRef = db.collection('devices')

        // Pegar os tokens e enviar a notificação
        const devices = await devicesRef.get();

        const tokens = [] as any;

        // loop
        devices.forEach(result => {
            const token = result.data().token;

            tokens.push(token)
        })

        // enviar a notificação para cada usuario cadastrado

        return admin.messaging().sendToDevice(tokens, payload)

    });

exports.novaOcorrencia = functions.firestore
    .document('ocorrenciasValidar/{ocorrenciasValidarID}')
    .onCreate(async event => {

        const data = event.data() as any;
        const tipo = data.tipo;
        const usuario = data.user.displayName;

        // Mensagem
        const payload = {
            notification: {
                title: `Nova Ocorrência gerada.`,
                body: `Nova Ocorrência, por: ${usuario}, do tipo ${tipo}`,
            }
        }

        const tokens = [
            'dWgqZHhC5CA:APA91bGiAJgwgYSylosYheJfTKB8j4KZ8rLWQugxdomCpr2Q34hUJJssbpEE86qQuv6LwrTIYpsnM1T6M7xskLz0CN15YwrDKQG78e8Ek5CaDzTgDGJW_xXInbnHgsPzIi8qnA5z-F45',
            'eqOKOk3QsOM:APA91bFcHu2NoBIVzJSsphozEg3-XX6e1hLjfnowHGeov-tuqTAtiUWJn45F3ucp30iw-vof_qHpL9ms2zprgN_lojNrl6biEL2ZoNPkfvpxaIPAmX4p_4yBM6YXucFrsKQcmlYJUjrt'
            ]

        // enviar a notificação para cada usuario cadastrado

        return admin.messaging().sendToDevice(tokens, payload)

    });

exports.ocorrenciaValidada = functions.firestore
    .document('ocorrenciasValidar/{ocorrenciasValidarID}')
    .onUpdate(async change => {

        const data = change.after.data() as any;
        const tipo = data.tipo

        const payload = {
            notification: {
                title: `Ocorrência disponível`,
                body: `Nova Ocorrência Validada, do tipo ${tipo}`
            }
        }

        // Referencias dos usuarios inscritos
        const db = admin.firestore()
        const devicesRef = db.collection('devices')

        // Pegar os tokens e enviar a notificação
        const devices = await devicesRef.get();

        const tokens = [] as any;

        // loop
        devices.forEach(result => {
            const token = result.data().token;

            tokens.push(token)
        })

        // enviar a notificação para cada usuario cadastrado

        return admin.messaging().sendToDevice(tokens, payload)

    })
