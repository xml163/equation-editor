eqEd.SuperscriptAndSubscriptWrapper = function(equation) {
	eqEd.Wrapper.call(this, equation); // call super constructor.
    this.className = "eqEd.SuperscriptAndSubscriptWrapper";

    this.superscriptContainer = new eqEd.SuperscriptContainer(this);
    this.subscriptContainer = new eqEd.SubscriptContainer(this);
    this.subscriptContainer.offsetTop = 0.45;

    this.domObj = this.buildDomObj();
    this.domObj.append(this.superscriptContainer.domObj);
    this.domObj.append(this.subscriptContainer.domObj);
    this.childContainers = [this.superscriptContainer, this.subscriptContainer];

    // Set up the padRight calculation
    var padRight = 0;
    this.properties.push(new Property(this, "padRight", padRight, {
        get: function() {
            return padRight;
        },
        set: function(value) {
            padRight = value;
        },
        compute: function() {
            var padRightVal = 0.05;
            if (this.index !== 0 
                && this.parent.wrappers[this.index - 1] instanceof eqEd.FunctionWrapper) {
                if (this.parent.wrappers[this.index + 1] instanceof eqEd.BracketWrapper
                    || this.parent.wrappers[this.index + 1] instanceof eqEd.BracketPairWrapper) {
                    padRightVal = 0.05;
                } else {
                    padRightVal = 0.175;
                }
            }
            return padRightVal;
        },
        updateDom: function() {}
    }));

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
        	var maxWidth = (this.superscriptContainer.width > this.subscriptContainer.width) ? this.superscriptContainer.width : this.subscriptContainer.width;
            return maxWidth;
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
        	var fontHeight = this.equation.fontMetrics.height[this.parent.fontSize];
            var baseWrapper = null;
            var base = null;
            var baseWrapperOverlap = 0.75;
            var superscriptContainerBottomAlign = 0;
            if (this.superscriptContainer.wrappers.length !== 0) {
                superscriptContainerBottomAlign = this.superscriptContainer.wrappers[this.superscriptContainer.maxBottomAlignIndex].bottomAlign;
            }
            if (this.index !== 0) {
                baseWrapper = this.parent.wrappers[this.index - 1];
                if (baseWrapper instanceof eqEd.SuperscriptWrapper || baseWrapper instanceof eqEd.SuperscriptAndSubscriptWrapper) {
                    base = baseWrapper.superscriptContainer;
                    fontHeight = this.equation.fontMetrics.height[base.fontSize];
                } else {
                    if (baseWrapper instanceof eqEd.SquareRootWrapper) {
                        baseWrapperOverlap = (superscriptContainerBottomAlign / baseWrapper.height);
                        if (baseWrapperOverlap > this.maxBaseWrapperOverlap) {
                            baseWrapperOverlap = this.maxBaseWrapperOverlap;
                        }
                    }
                    if (baseWrapper instanceof eqEd.NthRootWrapper) {
                        var baseWrapperOverlap = (superscriptContainerBottomAlign / baseWrapper.nthRootDiagonal.height);
                        if (baseWrapperOverlap > this.maxBaseWrapperOverlap) {
                            baseWrapperOverlap = this.maxBaseWrapperOverlap;
                        }
                    }
                    base = baseWrapper;
                }
            } else {
                // The superscript wrapper is the first entry in the container.
                // We want to format it, as if there is a symbol immediately
                // preceeding it.
                baseWrapper = new eqEd.SymbolWrapper(this.equation, 'a', 'MathJax_MathItalic');
                baseWrapper.index = 0;
                baseWrapper.parent = this.parent;
                // Can't just call baseWrapper.update(), because it creates a circular reference
                for (var i = 0; i < baseWrapper.properties.length; i++) {
                    var prop = baseWrapper.properties[i];
                    if (prop.propName !== "top" && prop.propName !== "left") {
                        prop.compute();
                    }
                }
                base = baseWrapper;
            }
            var topAlign = 0;
            if (baseWrapper instanceof eqEd.NthRootWrapper) {
                if (this.superscriptContainer.offsetTop * fontHeight + superscriptContainerBottomAlign > baseWrapper.nthRootDiagonal.height * baseWrapperOverlap) {
                    topAlign = this.superscriptContainer.height - (baseWrapper.nthRootDiagonal.height * baseWrapperOverlap - (base.topAlign - (base.height - baseWrapper.nthRootDiagonal.height)));
                } else {
                    topAlign = (baseWrapper.topAlign - (base.height - baseWrapper.nthRootDiagonal.height)) + this.superscriptContainer.height - superscriptContainerBottomAlign - this.superscriptContainer.offsetTop * fontHeight;
                }
            } else {
                if (this.superscriptContainer.offsetTop * fontHeight + superscriptContainerBottomAlign > base.height * baseWrapperOverlap) {
                    topAlign = this.superscriptContainer.height - (base.height * baseWrapperOverlap - baseWrapper.topAlign);
                } else {
                    topAlign = baseWrapper.topAlign + this.superscriptContainer.height - superscriptContainerBottomAlign - this.superscriptContainer.offsetTop * fontHeight;
                }
            }
            return topAlign - baseWrapper.padTop * fontHeight;
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
        	var baseWrapper = null;
            var base = null;
        	if (this.index !== 0) {
        		baseWrapper = this.parent.wrappers[this.index - 1];
                if (baseWrapper instanceof eqEd.SubscriptWrapper) {
                    base = baseWrapper.subscriptContainer;
                } else {
                    base = baseWrapper;
                }
        	} else {
        		// The subscript wrapper is the first entry in the container.
        		// We want to format it, as if there is a symbol immediately
        		// preceeding it.
        		baseWrapper = new eqEd.SymbolWrapper(this.equation, 'a', 'MathJax_MathItalic');
        		baseWrapper.index = 0;
                baseWrapper.parent = this.parent;
        		// Can't just call baseWrapper.update(), because it creates a circular reference
                for (var i = 0; i < baseWrapper.properties.length; i++) {
                    var prop = baseWrapper.properties[i];
                    if (prop.propName !== "top" && prop.propName !== "left") {
                        prop.compute();
                    }
                }
                base = baseWrapper;
        	}
            var fontHeightNested = this.equation.fontMetrics.height[this.subscriptContainer.fontSize];
            return this.subscriptContainer.height + baseWrapper.bottomAlign - this.subscriptContainer.offsetTop * fontHeightNested;
        },
        updateDom: function() {}
    }));
};

(function() {
    // subclass extends superclass
    eqEd.SuperscriptAndSubscriptWrapper.prototype = Object.create(eqEd.Wrapper.prototype);
    eqEd.SuperscriptAndSubscriptWrapper.prototype.constructor = eqEd.SuperscriptAndSubscriptWrapper;
    eqEd.SuperscriptAndSubscriptWrapper.prototype.buildDomObj = function() {
        return new eqEd.WrapperDom(this,
            '<div class="eqEdWrapper superscriptAndSubscriptWrapper"></div>')
    };
    eqEd.SuperscriptAndSubscriptWrapper.prototype.clone = function() {
        var copy = new this.constructor(this.equation);

        copy.superscriptContainer = this.superscriptContainer.clone();
        copy.superscriptContainer.parent = copy;
	    copy.subscriptContainer = this.subscriptContainer.clone();
        copy.subscriptContainer.parent = copy;
	    copy.subscriptContainer.offsetTop = 0.45;
	    copy.domObj = copy.buildDomObj();
	    copy.domObj.append(copy.superscriptContainer.domObj);
	    copy.domObj.append(copy.subscriptContainer.domObj);
	    copy.childContainers = [copy.superscriptContainer, copy.subscriptContainer];
        return copy;
    };
    eqEd.SuperscriptAndSubscriptWrapper.prototype.buildJsonObj = function() {
        var jsonObj = {
            type: this.className.substring(5, this.className.length - 7),
            value: null,
            operands: {
                superscript: this.superscriptContainer.buildJsonObj(),
                subscript: this.subscriptContainer.buildJsonObj()
            }
        };
        return jsonObj;
    };
    eqEd.SuperscriptAndSubscriptWrapper.constructFromJsonObj = function(jsonObj, equation) {
        var superscriptAndSubscriptWrapper = new eqEd.SuperscriptAndSubscriptWrapper(equation);
        for (var i = 0; i < jsonObj.operands.superscript.length; i++) {
            var innerWrapperCtor = eqEd.Equation.JsonTypeToConstructor(jsonObj.operands.superscript[i].type);
            var innerWrapper = innerWrapperCtor.constructFromJsonObj(jsonObj.operands.superscript[i], equation);
            superscriptAndSubscriptWrapper.superscriptContainer.addWrappers([i, innerWrapper]);
        }
        for (var i = 0; i < jsonObj.operands.subscript.length; i++) {
            var innerWrapperCtor = eqEd.Equation.JsonTypeToConstructor(jsonObj.operands.subscript[i].type);
            var innerWrapper = innerWrapperCtor.constructFromJsonObj(jsonObj.operands.subscript[i], equation);
            superscriptAndSubscriptWrapper.subscriptContainer.addWrappers([i, innerWrapper]);
        }
        return superscriptAndSubscriptWrapper;
    }
})();