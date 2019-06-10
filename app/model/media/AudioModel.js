SDL.AudioModel = Em.Object.extend({

    bluetoothModel: null,
    cdModel: null,
    lineInModel: null,
    usbModel: null,
    ipodModel: null,

    init: function() {
        this.set('bluetoothModel', SDL.BluetoothModel.create());
        this.set('cdModel', SDL.CDModel.create());
        this.set('lineInModel', SDL.LineInModel.create());
        this.set('usbModel', SDL.USBModel.create());
        this.set('ipodModel', SDL.IPodModel.create());        
    }
})