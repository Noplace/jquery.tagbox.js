/*
*
* jQuery Tag Box Widget Plugin v0.1
* Author        : Khalid Al-Kooheji (http://kkdev.blogspot.com)
* Version       : 0.1
* Last Modified : 10/05/2011
*
* Copyright 2011, Khalid Al-Kooheji
* Licensed under the MIT License (http://www.opensource.org/licenses/mit-license.php)
*
*/


$.widget("ui.tagbox", {
    _insertTag: function (val) {
        var self = this;
        var tagList = self.getTagList();
        if (self.options.allowDuplicates == false) {
            for (var i = 0; i < tagList.length; ++i) {
                if (tagList[i] == val)
                    return false;
            }
        }
        self.element.children().last().before('<li class="ui-widget ui-widget-content ui-corner-all"><span>' + this.options.formatter(val) + '</span><div class="ui-icon ui-icon-close"></div></li>');
        var obj = self.element.children().last().prev();

        obj.attr('data-value', val);

        obj.children('.ui-icon').click(function () {
            var index = self.element.children('li').index($(this).parent());
            self._removeTag(index);
        });

        self.element.sortable({ containment: 'parent' });
        self.element.disableSelection();
        return true;
    },

    _removeLastTag: function () {
        var self = this;
        var length = self.element.children('li').length;
        if (length > 0) {
            self.element.children().last().prev().remove();
        }
    },

    _removeTag: function (index) {
        var self = this;
        var length = self.element.children('li').length;
        if (index >= 0 && index < length && length != 0) {
            $(self.element.children()[index]).remove();
        }
    },

    getTagList: function () {

        var result = new Array();
        this.element.children('li').each(function () {
            result.push($(this).attr('data-value'));
        })
        return result;
    },
    options: {
        suggestionsSource: null,
        allowDuplicates: false,
        tagList: null,
        formatter: function (val) {
            return '<span>' + val + '</span>';
        }
    },
    _setOption: function (key, value) {
        var self = this;

        if (key == 'tagList') {
            self.element.children('li').remove();
            for (var i = 0; i < value.length; i++) {
                self._insertTag(value[i]);
            }
        }
    },
    _create: function () {
        var self = this;
        self.element.wrap('<div style="display:inline-block;">');
        self.element.addClass('tagbox');


        if (this.options.tagList == null)
            this.options.tagList = new Array();


        var element = self.element;
        var __x = false;
        var _input = $('<input type="text" style="width:auto;" />');
        self.element.append(_input);
        if (self.options.suggestionsSource != undefined) {
            _input.autocomplete({
                source: self.options.suggestionsSource,
                select: function (event, ui) {
                    if (self._insertTag(ui.item.value) == true)
                        __x = true;

                }, close: function (event, ui) {
                    if (__x == true) {
                        _input.val('');
                        __x = false;
                    }
                }
            });


        }

        self._setOption('tagList', this.options.tagList);


        element.click(function () {
            $(this).children('input').first().focus();
        });

        element.children('li').click(function (e) {
            e.preventDefault();
        });

        element.children('input').keydown(function (e) {
            if (e.which == 8) {
                var val = $(this).val();
                if (val == '' || val == null) {
                    self._removeLastTag();
                }
            }

        });


        element.children('input').keypress(function (e) {

            if (e.which == 32 || e.which == 13) {
                e.preventDefault();
                var val = $(this).val();
                if (val == '')
                    return;



                if (self._insertTag(val) == true)
                    $(this).val('');
            }
            var k = String.fromCharCode(e.which);
            if (k.match(/[^a-zA-Z0-9 ]/g)) {
                e.preventDefault();
            }
        });
    },
    destroy: function () {
        $.Widget.prototype.destroy.apply(this, arguments);
    }
});