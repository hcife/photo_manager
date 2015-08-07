var gfilter = {
    type: "canvas",
    name: "filters",
    author: "zhigang",

    getInfo: function () {
        return this.author + ' ' + this.type + ' ' + this.name;
    },

    /**
     * invert color value of pixel, new pixel = RGB(255-r, 255-g, 255 - b)
     *
     * @param binaryData - canvas's imagedata.data
     * @param l - length of data (width * height of image data)
     */
    colorInvertProcess: function (binaryData, l) {
        for (var i = 0; i < l; i += 4) {
            var r = binaryData[i];
            var g = binaryData[i + 1];
            var b = binaryData[i + 2];

            binaryData[i] = 255 - r;
            binaryData[i + 1] = 255 - g;
            binaryData[i + 2] = 255 - b;
        }
    },

    /**
     * adjust color values and make it more darker and gray...
     *
     * @param binaryData
     * @param l
     */
    colorAdjustProcess: function (binaryData, l) {
        for (var i = 0; i < l; i += 4) {
            var r = binaryData[i];
            var g = binaryData[i + 1];
            var b = binaryData[i + 2];

            binaryData[i] = (r * 0.272) + (g * 0.534) + (b * 0.131);
            binaryData[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
            binaryData[i + 2] = (r * 0.393) + (g * 0.769) + (b * 0.189);
        }
    },

    /**
     * deep clone image data of canvas
     *
     * @param context
     * @param src
     * @returns
     */
    copyImageData: function (context, src) {
        var dst = context.createImageData(src.width, src.height);
        dst.data.set(src.data);
        return dst;
    },

    /**
     * convolution - keneral size 5*5 - blur effect filter(模糊效果)
     *
     * @param context
     * @param canvasData
     */
    blurProcess: function (context, canvasData) {
        console.log("Canvas Filter - blur process");
        var tempCanvasData = this.copyImageData(context, canvasData);
        var sumred = 0.0, sumgreen = 0.0, sumblue = 0.0;
        for (var x = 0; x < tempCanvasData.width; x++) {
            for (var y = 0; y < tempCanvasData.height; y++) {

                // Index of the pixel in the array      
                var idx = (x + y * tempCanvasData.width) * 4;
                for (var subCol = -2; subCol <= 2; subCol++) {
                    var colOff = subCol + x;
                    if (colOff < 0 || colOff >= tempCanvasData.width) {
                        colOff = 0;
                    }
                    for (var subRow = -2; subRow <= 2; subRow++) {
                        var rowOff = subRow + y;
                        if (rowOff < 0 || rowOff >= tempCanvasData.height) {
                            rowOff = 0;
                        }
                        var idx2 = (colOff + rowOff * tempCanvasData.width) * 4;
                        var r = tempCanvasData.data[idx2 + 0];
                        var g = tempCanvasData.data[idx2 + 1];
                        var b = tempCanvasData.data[idx2 + 2];
                        sumred += r;
                        sumgreen += g;
                        sumblue += b;
                    }
                }

                // calculate new RGB value  
                var nr = (sumred / 25.0);
                var ng = (sumgreen / 25.0);
                var nb = (sumblue / 25.0);

                // clear previous for next pixel point  
                sumred = 0.0;
                sumgreen = 0.0;
                sumblue = 0.0;

                // assign new pixel value      
                canvasData.data[idx + 0] = nr; // Red channel      
                canvasData.data[idx + 1] = ng; // Green channel      
                canvasData.data[idx + 2] = nb; // Blue channel      
                canvasData.data[idx + 3] = 255; // Alpha channel      
            }
        }
    },

    /**
     * after pixel value - before pixel value + 128
     * 浮雕效果
     */
    reliefProcess: function (context, canvasData) {
        console.log("Canvas Filter - relief process");
        var tempCanvasData = this.copyImageData(context, canvasData);
        for (var x = 1; x < tempCanvasData.width - 1; x++) {
            for (var y = 1; y < tempCanvasData.height - 1; y++) {

                // Index of the pixel in the array      
                var idx = (x + y * tempCanvasData.width) * 4;
                var bidx = ((x - 1) + y * tempCanvasData.width) * 4;
                var aidx = ((x + 1) + y * tempCanvasData.width) * 4;

                // calculate new RGB value  
                var nr = tempCanvasData.data[aidx + 0] - tempCanvasData.data[bidx + 0] + 128;
                var ng = tempCanvasData.data[aidx + 1] - tempCanvasData.data[bidx + 1] + 128;
                var nb = tempCanvasData.data[aidx + 2] - tempCanvasData.data[bidx + 2] + 128;
                nr = (nr < 0) ? 0 : ((nr > 255) ? 255 : nr);
                ng = (ng < 0) ? 0 : ((ng > 255) ? 255 : ng);
                nb = (nb < 0) ? 0 : ((nb > 255) ? 255 : nb);

                // assign new pixel value      
                canvasData.data[idx + 0] = nr; // Red channel      
                canvasData.data[idx + 1] = ng; // Green channel      
                canvasData.data[idx + 2] = nb; // Blue channel      
                canvasData.data[idx + 3] = 255; // Alpha channel      
            }
        }
    },

    /**
     *  before pixel value - after pixel value + 128
     *  雕刻效果
     *
     * @param canvasData
     */
    diaokeProcess: function (context, canvasData) {
        console.log("Canvas Filter - process");
        var tempCanvasData = this.copyImageData(context, canvasData);
        for (var x = 1; x < tempCanvasData.width - 1; x++) {
            for (var y = 1; y < tempCanvasData.height - 1; y++) {

                // Index of the pixel in the array      
                var idx = (x + y * tempCanvasData.width) * 4;
                var bidx = ((x - 1) + y * tempCanvasData.width) * 4;
                var aidx = ((x + 1) + y * tempCanvasData.width) * 4;

                // calculate new RGB value  
                var nr = tempCanvasData.data[bidx + 0] - tempCanvasData.data[aidx + 0] + 128;
                var ng = tempCanvasData.data[bidx + 1] - tempCanvasData.data[aidx + 1] + 128;
                var nb = tempCanvasData.data[bidx + 2] - tempCanvasData.data[aidx + 2] + 128;
                nr = (nr < 0) ? 0 : ((nr > 255) ? 255 : nr);
                ng = (ng < 0) ? 0 : ((ng > 255) ? 255 : ng);
                nb = (nb < 0) ? 0 : ((nb > 255) ? 255 : nb);

                // assign new pixel value      
                canvasData.data[idx + 0] = nr; // Red channel      
                canvasData.data[idx + 1] = ng; // Green channel      
                canvasData.data[idx + 2] = nb; // Blue channel      
                canvasData.data[idx + 3] = 255; // Alpha channel      
            }
        }
    },

    /**
     * mirror reflect
     *
     * @param context
     * @param canvasData
     */
    mirrorProcess: function (context, canvasData) {
        console.log("Canvas Filter - process");
        var tempCanvasData = this.copyImageData(context, canvasData);
        for (var x = 0; x < tempCanvasData.width; x++) // column
        {
            for (var y = 0; y < tempCanvasData.height; y++) // row
            {

                // Index of the pixel in the array      
                var idx = (x + y * tempCanvasData.width) * 4;
                var midx = (((tempCanvasData.width - 1) - x) + y * tempCanvasData.width) * 4;

                // assign new pixel value      
                canvasData.data[midx + 0] = tempCanvasData.data[idx + 0]; // Red channel      
                canvasData.data[midx + 1] = tempCanvasData.data[idx + 1];
                ; // Green channel
                canvasData.data[midx + 2] = tempCanvasData.data[idx + 2];
                ; // Blue channel
                canvasData.data[midx + 3] = 255; // Alpha channel      
            }
        }
    },
};  