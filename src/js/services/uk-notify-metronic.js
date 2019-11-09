let ukNotifyService = (function () {
    let containers = {},
        messages = {},
        notify = function (options) {
            //{title:title, message:message, status:status, icon:icon, pos:pos, timeout:timeout}
            return (new Message(options)).show();
        },
        closeAll = function (instantly) {
            for (let id in messages)
                messages[id].close(instantly);
        };
    let Message = function (options) {
        this.options = {
            title: options.title ? options.title : Message.defaults.title,
            message: options.message ? options.message : Message.defaults.message,
            status: options.status ? options.status : Message.defaults.status,
            icon: options.icon ? options.icon : Message.defaults.icon,
            pos: options.pos ? options.pos : Message.defaults.pos,
            timeout: options.timeout != null ? options.timeout : Message.defaults.timeout
        };
        this.uuid = "ID" + (new Date().getTime()) + "RAND" + (Math.ceil(Math.random() * 100000));
        this.element = $([
            '<div class="uk-notify-message">',
            options.icon ? '<div class="alert-icon">' + options.icon + '</div>' : '',
            '<div class="alert-text">',
            options.title ? '<h4 class="alert-heading">' + options.title + '</h4>' : '',
            this.options.message,
            '</div>',
            '<div class="alert-close">',
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">',
            '<span aria-hidden="true"><i class="la la-close"></i></span>',
            '</button>',
            '</div>',
            '</div>'

        ].join('')).data("notifyMessage", this);

        // status
        if (this.options.status)
            this.element.addClass('alert alert-' + this.options.status);

        messages[this.uuid] = this;
        if (!containers[this.options.pos])
            containers[this.options.pos] = $('<div class="uk-notify uk-notify-' + this.options.pos + '"></div>').appendTo('body').on("click", ".uk-notify-message", function () {
                $(this).data("notifyMessage").close();
            });
    };
    $.extend(Message.prototype, {
        show: function () {
            if (this.element.is(":visible")) return;
            let $this = this;
            containers[this.options.pos].show().prepend(this.element);
            let marginbottom = parseInt(this.element.css("margin-bottom"), 10);
            this.element.css({
                "opacity": 0,
                "margin-top": -1 * this.element.outerHeight(),
                "margin-bottom": 0
            }).animate({
                "opacity": 1,
                "margin-top": 0,
                "margin-bottom": marginbottom
            }, function () {
                if ($this.options.timeout) {
                    let closefn = function () {
                        $this.close();
                    };
                    $this.timeout = setTimeout(closefn, $this.options.timeout);
                    $this.element.hover(
                        function () {
                            clearTimeout($this.timeout);
                        },
                        function () {
                            $this.timeout = setTimeout(closefn, $this.options.timeout);
                        }
                    );
                }
            });
            return this;
        },
        close: function (instantly) {
            let $this = this,
                finalize = function () {
                    $this.element.remove();
                    if (!containers[$this.options.pos].children().length)
                        containers[$this.options.pos].hide();
                    delete messages[$this.uuid];
                };
            if (this.timeout) clearTimeout(this.timeout);
            if (instantly)
                finalize();
            else
                this.element.animate({
                    "opacity": 0,
                    "margin-top": -1 * this.element.outerHeight(),
                    "margin-bottom": 0
                }, function () {
                    finalize();
                });
        }
    });
    Message.defaults = {
        title: '',
        message: '',
        status: "normal",
        icon: '',
        timeout: 5000,
        pos: 'bottom-right'
    };
    return {
        notify: notify,
        closeAll: closeAll
    };
})();

