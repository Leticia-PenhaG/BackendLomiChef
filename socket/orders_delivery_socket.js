module.exports = (io) => {
    const orderDeliveryNameSpace = io.of('/orders/delivery');

    orderDeliveryNameSpace.on('connection', function(socket){
        console.log('Usuario conectado al NAMESPACE /orders/delivery');

        socket.on('position', function(data) {
            //console.log(`Conducto emitió $(data)`);
            console.log(`Conductor emitió ${JSON.stringify(data)}`);
            orderDeliveryNameSpace.emit(`position/${data.id_order}`, {lat: data.lat, lng: data.lng})  //emitir un dato al cliente  
        });

        socket.on('disconnect', function(data){
            console.log('USUARIO DESCONECTADO');
        });
    });


}    