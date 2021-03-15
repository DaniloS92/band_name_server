const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('System of Down'));
bands.addBand(new Band('Queen'));
bands.addBand(new Band('Linkin Park'));
bands.addBand(new Band('Metallica'));

// Mensajes de sockets
io.on('connection', client => {

    // console.log(`Cliente contectado: ${client.id}`);

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log(`Cliente desconectado: ${client.id}`);
    });

    client.on('mensaje', (payload) => {
        console.log(`mensaje:`, payload);
        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    });

    client.on('add-band', ( payload ) => {
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
     });

    client.on('vote-band', ( payload ) => {
       bands.voteBand(payload.id);
       io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', ( payload ) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
     });

});