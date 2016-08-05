// Point model to do mapping between

function Point(options) {
    this.marker  = options.marker;

    this.element = null; // DOM element added by a directive

    this.marker.addListener('click', function () {
        console.log('click event');
    });
};

Point.prototype.setElement = function (element) {
    if(this.element === null) {
        this.element = element;
    }

    return this;
}

module.exports = Point;
