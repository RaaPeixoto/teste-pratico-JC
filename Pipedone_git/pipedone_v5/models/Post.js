const db = require('./db')

const Pipes = db.sequelize.define('ph_pipes', {
    organization_id: { type: db.Sequelize.INTEGER },
    creator_id: { type: db.Sequelize.INTEGER },
    list_id: { type: db.Sequelize.JSON },
    conections: { type: db.Sequelize.JSON },
    metadata: { type: db.Sequelize.JSON },
    title: { type: db.Sequelize.STRING },
    users: { type: db.Sequelize.TEXT },
    image: { type: db.Sequelize.STRING },
    color: { type: db.Sequelize.STRING },
    type: { type: db.Sequelize.STRING },
    status: { type: db.Sequelize.STRING }
});

const Steps = db.sequelize.define('ph_steps', {
    title: { type: db.Sequelize.STRING },
    position: { type: db.Sequelize.STRING },
    organization_id: { type: db.Sequelize.INTEGER },
    pipe_id: { type: db.Sequelize.INTEGER },
    color: { type: db.Sequelize.STRING },
    metadata: { type: db.Sequelize.JSON },
    status: { type: db.Sequelize.STRING }
});

const Cards = db.sequelize.define('ph_cards', {
    organization_id: { type: db.Sequelize.INTEGER },
    pipe_id: { type: db.Sequelize.INTEGER },
    step_id: { type: db.Sequelize.INTEGER },
    list_id: { type: db.Sequelize.INTEGER },
    item_id: { type: db.Sequelize.INTEGER },
    client_id: { type: db.Sequelize.INTEGER },
    responsible_id: { type: db.Sequelize.INTEGER },
    deadline: { type: db.Sequelize.DATE },
    creator_id: { type: db.Sequelize.INTEGER },
    metadata: { type: db.Sequelize.JSON }, // Comentários, histórico, documents, etc
    status: { type: db.Sequelize.STRING },
});

const Forms = db.sequelize.define('ph_forms', {
    organization_id: { type: db.Sequelize.INTEGER },
    title: { type: db.Sequelize.STRING },
    color: { type: db.Sequelize.STRING },
    image: { type: db.Sequelize.STRING },
    fields: { type: db.Sequelize.JSON }, // Comentários, histórico, documents, etc
    creator_id: { type: db.Sequelize.INTEGER },
    status: { type: db.Sequelize.STRING },
});

const Users = db.sequelize.define('ph_users', {
    name: { type: db.Sequelize.STRING },
    email: {
        type: db.Sequelize.STRING,
        unique: true
    },
    phone: { type: db.Sequelize.STRING },
    cpf: { type: db.Sequelize.STRING },
    pass: { type: db.Sequelize.STRING },
    type: { type: db.Sequelize.STRING }, // MASTER or INVITED
    organization_id: { type: db.Sequelize.INTEGER },
    metadata: { type: db.Sequelize.JSON },
    permissions: { type: db.Sequelize.JSON },
    status: { type: db.Sequelize.STRING },
});

const Organizations = db.sequelize.define('ph_organizations', {
    name: { type: db.Sequelize.STRING },
    token: { type: db.Sequelize.STRING },
    plan_id: { type: db.Sequelize.STRING },
    property_of: { type: db.Sequelize.INTEGER },
    metadata: { type: db.Sequelize.JSON },
    status: { type: db.Sequelize.STRING }
});

const Clients = db.sequelize.define('ph_clients', {
    organization_id: { type: db.Sequelize.STRING },
    creator_id: { type: db.Sequelize.INTEGER },
    responsible_id: { type: db.Sequelize.INTEGER },
    card_id: { type: db.Sequelize.INTEGER },
    list_id: { type: db.Sequelize.INTEGER },
    metadata: { type: db.Sequelize.JSON }, // armazenar aqui todos os dados do cliente
    status: { type: db.Sequelize.STRING }
});

const Lists = db.sequelize.define('ph_lists', {
    organization_id: { type: db.Sequelize.STRING },
    creator_id: { type: db.Sequelize.INTEGER },
    title: { type: db.Sequelize.STRING },
    users: { type: db.Sequelize.TEXT },
    color: { type: db.Sequelize.STRING },
    img: { type: db.Sequelize.STRING },
    metadata: { type: db.Sequelize.JSON }, // armazenar aqui todos os dados do cliente
    status: { type: db.Sequelize.STRING }
});

const Itens = db.sequelize.define('ph_itens', {
    organization_id: { type: db.Sequelize.STRING },
    creator_id: { type: db.Sequelize.INTEGER },
    list_id: { type: db.Sequelize.STRING },
    metadata: { type: db.Sequelize.JSON }, // armazenar aqui todos os dados do cliente
    status: { type: db.Sequelize.STRING }
});

const Models = db.sequelize.define('ph_models', {
    organization_id: { type: db.Sequelize.STRING },
    creator_id: { type: db.Sequelize.INTEGER },
    list_id: { type: db.Sequelize.INTEGER },
    title: { type: db.Sequelize.STRING },
    metadata: { type: db.Sequelize.JSON },
    text: { type: db.Sequelize.TEXT },
    type: { type: db.Sequelize.STRING }, // PHOTO, SIGNATURE
    status: { type: db.Sequelize.STRING }
});

// Links

const Signatures = db.sequelize.define('ph_signatures', {
    organization_id: { type: db.Sequelize.STRING },
    client_id: { type: db.Sequelize.INTEGER },
    creator_id: { type: db.Sequelize.INTEGER },
    card_id: { type: db.Sequelize.INTEGER },
    document: { type: db.Sequelize.TEXT },
    signedDocument: { type: db.Sequelize.STRING },
    metadata: { type: db.Sequelize.JSON }, // Armazenar dia, hora, ip e localização no nó inventory
    signers: { type: db.Sequelize.JSON },
    signatureDate: { type: db.Sequelize.DATE },
    status: { type: db.Sequelize.STRING }
});

const Proposals = db.sequelize.define('ph_proposals', {
    organization_id: { type: db.Sequelize.STRING },
    creator_id: { type: db.Sequelize.INTEGER },
    card_id: { type: db.Sequelize.INTEGER },
    value: { type: db.Sequelize.STRING },
    metadata: { type: db.Sequelize.JSON }, // esse campo vai variar de acordo com o Type
    type: { type: db.Sequelize.STRING }, // De acordo com 
    status: { type: db.Sequelize.STRING }
});

const Photos = db.sequelize.define('ph_photos', {
    organization_id: { type: db.Sequelize.STRING },
    client_id: { type: db.Sequelize.INTEGER },
    creator_id: { type: db.Sequelize.INTEGER },
    card_id: { type: db.Sequelize.INTEGER },
    stepsForPhotos: { type: db.Sequelize.JSON },
    photos: { type: db.Sequelize.JSON },
    metadata: { type: db.Sequelize.JSON }, // Armazenar dia, hora, ip, localização, placa, campos exigidos
    status: { type: db.Sequelize.STRING }
});

const Pdfs = db.sequelize.define('ph_pdfs', {
    organization_id: { type: db.Sequelize.STRING },
    client_id: { type: db.Sequelize.INTEGER },
    creator_id: { type: db.Sequelize.INTEGER },
    card_id: { type: db.Sequelize.INTEGER },
    document: { type: db.Sequelize.STRING },
    metadata: { type: db.Sequelize.JSON },
    status: { type: db.Sequelize.STRING }
});

// Likn de pagamento pelo HubyPay
const Payments = db.sequelize.define('ph_payments', {
    organization_id: { type: db.Sequelize.STRING },
    client_id: { type: db.Sequelize.INTEGER },
    creator_id: { type: db.Sequelize.INTEGER },
    card_id: { type: db.Sequelize.INTEGER },
    metadata: { type: db.Sequelize.JSON },
    value: { type: db.Sequelize.FLOAT },
    status: { type: db.Sequelize.STRING }
});

// Pagamento e outros
const Plans = db.sequelize.define('ph_plans', {
    plan_id: { type: db.Sequelize.INTEGER },
    organization_id: { type: db.Sequelize.INTEGER },
    metadata: { type: db.Sequelize.JSON }, // tipo de plano, metodo de pagamento, nota fiscal, etc...
    value: { type: db.Sequelize.FLOAT },
    status: { type: db.Sequelize.STRING }
});

const Subscriptions = db.sequelize.define('ph_subscriptions', {
    plan_id: { type: db.Sequelize.STRING },
    subscription_id: { type: db.Sequelize.STRING },
    organization_id: { type: db.Sequelize.INTEGER },
    nota_fiscal: { type: db.Sequelize.STRING },
    plan: { type: db.Sequelize.STRING },
    payment_method: { type: db.Sequelize.STRING },
    period: { type: db.Sequelize.STRING },
    url_boleto: { type: db.Sequelize.TEXT },
    invoiceJson: { type: db.Sequelize.JSON },
    paymentJson: { type: db.Sequelize.JSON },
    amount: { type: db.Sequelize.FLOAT },
    status: { type: db.Sequelize.STRING }
});
const Invoices = db.sequelize.define('ph_invoices', {
    plan_id: { type: db.Sequelize.STRING },
    subscription_id: { type: db.Sequelize.STRING },
    invoice_id:{ type: db.Sequelize.STRING },
    organization_id: { type: db.Sequelize.INTEGER },
    nota_fiscal: { type: db.Sequelize.STRING },
    plan: { type: db.Sequelize.STRING },
    payment_method: { type: db.Sequelize.STRING },
    url_boleto: { type: db.Sequelize.TEXT },
    invoiceJson: { type: db.Sequelize.JSON },
    paymentJson: { type: db.Sequelize.JSON },
    amount: { type: db.Sequelize.FLOAT },
    status: { type: db.Sequelize.STRING }
});
const Chats = db.sequelize.define('ph_chats', {
    organization_id: { type: db.Sequelize.STRING },
    metadata: { type: db.Sequelize.JSON }, // tipo de plano, metodo de pagamento, nota fiscal, etc...
    message: { type: db.Sequelize.TEXT },
    sender: { type: db.Sequelize.INTEGER },
    recipient: { type: db.Sequelize.INTEGER },
    status: { type: db.Sequelize.STRING }
});

const Agendas = db.sequelize.define('ph_agendas', {
    organization_id: { type: db.Sequelize.INTEGER },
    user_id: { type: db.Sequelize.INTEGER },
    note: { type: db.Sequelize.TEXT },
    date: { type: db.Sequelize.DATE },
    time: { type: db.Sequelize.TIME },
    status: { type: db.Sequelize.STRING }
});

const pipePay = db.sequelize.define('ph_pipepays', {
    organization_id: { type: db.Sequelize.INTEGER },
    proposal_id: { type: db.Sequelize.INTEGER },
    value: { type: db.Sequelize.STRING },
    payment_method: { type: db.Sequelize.STRING },
    transation_id: { type: db.Sequelize.INTEGER },
    link: { type: db.Sequelize.STRING },
    type: { type: db.Sequelize.STRING },
    metadata: { type: db.Sequelize.JSON },
    status: { type: db.Sequelize.STRING }
});

const Analisys = db.sequelize.define('ph_analisys', {
    organization_id: { type: db.Sequelize.INTEGER },
    user_id: { type: db.Sequelize.INTEGER },
    pipe_id: { type: db.Sequelize.INTEGER },
    card_id: { type: db.Sequelize.INTEGER },
    action: { type: db.Sequelize.STRING },
    reg_date: { type: db.Sequelize.STRING },
    metadata: { type: db.Sequelize.JSON },
});

const Notifications = db.sequelize.define('ph_notifications', {
    organization_id: { type: db.Sequelize.INTEGER },
    user_id: { type: db.Sequelize.INTEGER },
    text: { type: db.Sequelize.TEXT },
    type: { type: db.Sequelize.STRING},
    status: { type: db.Sequelize.STRING }, 
    metadata: { type: db.Sequelize.JSON },
});

// Controle de assinaturas e pagamentos


// Assinaturas.sync();
// Pagamentos.sync();
// Pipes.sync();
// Steps.sync();
// Cards.sync();
// Users.sync();
// Organizations.sync();
// Clients.sync();
// Lists.sync();
// Signatures.sync();
// Proposals.sync();
// Photos.sync();
// Payments.sync();
// Plans.sync();
// Models.sync();
// Forms.sync();
// Pdfs.sync();
// Chats.sync();
// Agendas.sync();
// Analisys.sync();
// Subscriptions.sync();
// pipePay.sync();
// Itens.sync();
//Notifications.sync();
//Invoices.sync();

module.exports = {
    Pipes: Pipes,
    Steps: Steps,
    Cards: Cards,
    Users: Users,
    Organizations: Organizations,
    Clients: Clients,
    Lists: Lists,
    Signatures: Signatures,
    Proposals: Proposals,
    Photos: Photos,
    Payments: Payments,
    Plans: Plans,
    Models: Models,
    Forms: Forms,
    Chats: Chats,
    Agendas: Agendas,
    pipePay: pipePay,
    Analisys: Analisys,
    Subscriptions: Subscriptions,
    Itens: Itens,
    Notifications:Notifications,
    Invoices:Invoices,
}