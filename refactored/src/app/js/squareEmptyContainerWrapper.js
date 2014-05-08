eqEd.SquareEmptyContainerWrapper = function(symbolSizeConfig) {
    eqEd.Wrapper.call(this, symbolSizeConfig); // call super constructor.

    this.squareEmptyContainer = new eqEd.SquareEmptyContainer(symbolSizeConfig);
    this.squareEmptyContainer.parent = this;
    this.domObj = this.buildDomObj();
    this.domObj.append(this.squareEmptyContainer.domObj);
    this.childContainers = [this.squareEmptyContainer];

    this.padLeft = 0.05;
    this.padRight = 0.05;

    // Set up the width calculation
    var width = 0;
    this.properties.push(new Property(this, "width", width, {
        get: function() {
            return width;
        },
        set: function(value) {
            width = value;
        },
        compute: function() {
            return this.squareEmptyContainer.width;
        },
        updateDom: function() {
            this.domObj.updateWidth(this.width);
        }
    }));

    // Set up the topAlign calculation
    var topAlign = 0;
    this.properties.push(new Property(this, "topAlign", topAlign, {
        get: function() {
            return topAlign;
        },
        set: function(value) {
            topAlign = value;
        },
        compute: function() {
            var fontHeight = this.symbolSizeConfig.height[this.parent.fontSize];
            return 0.5 * fontHeight;
        },
        updateDom: function() {}
    }));

    // Set up the bottomAlign calculation
    var bottomAlign = 0;
    this.properties.push(new Property(this, "bottomAlign", bottomAlign, {
        get: function() {
            return bottomAlign;
        },
        set: function(value) {
            bottomAlign = value;
        },
        compute: function() {
            var fontHeight = this.symbolSizeConfig.height[this.parent.fontSize];
            return 0.5 * fontHeight;
        },
        updateDom: function() {}
    }));
};
(function() {
    // subclass extends superclass
    eqEd.SquareEmptyContainerWrapper.prototype = Object.create(eqEd.Wrapper.prototype);
    eqEd.SquareEmptyContainerWrapper.prototype.constructor = eqEd.SquareEmptyContainerWrapper;
    eqEd.SquareEmptyContainerWrapper.prototype.buildDomObj = function() {
        return new eqEd.WrapperDom(this,
            '<div class="wrapper emptyContainerWrapper squareEmptyContainerWrapper"></div>')
    }
});