(function ($) {
    "use strict"
    if (!String.prototype.includes) {
        String.prototype.includes = function (search, start) {
            'use strict';
            if (typeof start !== 'number') {
                start = 0;
            }

            if (start + search.length > this.length) {
                return false;
            } else {
                return this.indexOf(search, start) !== -1;
            }
        };
    }


    // Fixed Nav
    var lastScrollTop = 0;
    $(window).on('scroll', function () {
        var wScroll = $(this).scrollTop();
        if (wScroll > $('#nav').height()) {
            if (wScroll < lastScrollTop) {
                $('#nav-fixed').removeClass('slide-up').addClass('slide-down');
            } else {
                $('#nav-fixed').removeClass('slide-down').addClass('slide-up');
            }
        }
        lastScrollTop = wScroll
    });

    // Search Nav
    $('.search-btn').on('click', function () {
        $('.search-form').addClass('active');
    });

    $('.search-close').on('click', function () {
        $('.search-form').removeClass('active');
    });

    // Aside Nav
    $(document).click(function (event) {
        if (!$(event.target).closest($('#nav-aside')).length) {
            if ($('#nav-aside').hasClass('active')) {
                $('#nav-aside').removeClass('active');
                $('#nav').removeClass('shadow-active');
            } else {
                if ($(event.target).closest('.aside-btn').length) {
                    $('#nav-aside').addClass('active');
                    $('#nav').addClass('shadow-active');
                }
            }
        }
    });

    $('.nav-aside-close').on('click', function () {
        $('#nav-aside').removeClass('active');
        $('#nav').removeClass('shadow-active');
    });

    // Sticky Shares
    var $shares = $('.sticky-container .sticky-shares'),
        $sharesHeight = $shares.height(),
        $sharesTop,
        $sharesCon = $('.sticky-container'),
        $sharesConTop,
        $sharesConleft,
        $sharesConHeight,
        $sharesConBottom,
        $offsetTop = 80;

    function setStickyPos() {
        if ($shares.length > 0) {
            $sharesTop = $shares.offset().top
            $sharesConTop = $sharesCon.offset().top;
            $sharesConleft = $sharesCon.offset().left;
            $sharesConHeight = $sharesCon.height();
            $sharesConBottom = $sharesConHeight + $sharesConTop;
        }
    }

    function stickyShares(wScroll) {
        if ($shares.length > 0) {
            if ($sharesConBottom - $sharesHeight - $offsetTop < wScroll) {
                $shares.css({ position: 'absolute', top: $sharesConHeight - $sharesHeight, left: 0 });
            } else if ($sharesTop < wScroll + $offsetTop) {
                $shares.css({ position: 'fixed', top: $offsetTop, left: $sharesConleft });
            } else {
                $shares.css({ position: 'absolute', top: 0, left: 0 });
            }
        }
    }

    $(window).on('scroll', function () {
        stickyShares($(this).scrollTop());
    });

    $(window).resize(function () {
        setStickyPos();
        stickyShares($(this).scrollTop());
    });

    setStickyPos();

    if (location.pathname.includes("/category/") || location.pathname.includes("/news/")) {
        const post_widget = $("#post-widget");
        if (post_widget) {
            $.ajax("/api/getLatestNews", {
                type: 'GET',
                dataType: 'json',
            }).done((_news) => {
                for (let i = 0, l = _news.data.length; i < l; i++) {
                    post_widget.append(`<div class="post post-widget">
                    <a class="post-img" href="${_news.data[i].link}"><img src="/img/news_avatar/${_news.data[i].avatar}" alt=""></a>
                    <div class="post-body">
                        <h3 class="post-title"><a href="${_news.data[i].link}">${_news.data[i].title}</a></h3>
                    </div>
                    </div>`)
                }
            }).fail(function (xhr, textStatus, errorThrown) {
                alert(xhr.responseText);
            });;
        }

        const ul_category_widget = $("#ul-category-widget");
        if (ul_category_widget) {
            $.ajax("/api/getCategoriesAndNumNews", {
                type: 'GET',
                dataType: 'json',
            }).done((categories) => {

                for (let i = 0, l = categories.data.length; i < l; i++) {
                    ul_category_widget.append(`<li><a href="${categories.data[i].link}" class="cat-2">${categories.data[i].name}<span>${categories.data[i].num_news}</span></a></li>`)
                }
            }).fail(function (xhr, textStatus, errorThrown) {
                alert(xhr.responseText);
            });
        }
    }

    if (location.pathname.includes("/news")) {
        const news_post = $('#news-content');
        if (news_post) {
            $.ajax("/api/getNewsById/" + news_post.attr('params'), {
                type: 'GET',
                dataType: 'json',
            }).done(news => {
                console.log(news)
                news_post.append(news.data.content);
                window.scrollTo(0, 0);
            }).fail(function (xhr, textStatus, errorThrown) {
                alert(xhr.responseText);
            });
        }

        const post_widget_same_category = $('#post-widget-same-category');
        if (post_widget_same_category) {
            $.ajax("/api/getLatestNewsByIdNews/" + post_widget_same_category.attr('idCategory'), {
                type: 'GET',
                dataType: 'json',
            }).done((_news) => {
                for (let i = 0, l = _news.data.length; i < l; i++) {
                    post_widget_same_category.append(`<div class="post post-widget">
                    <a class="post-img" href="${_news.data[i].link}"><img src="/img/news_avatar/${_news.data[i].avatar}" alt=""></a>
                    <div class="post-body">
                        <h3 class="post-title"><a href="${_news.data[i].link}">${_news.data[i].title}</a></h3>
                    </div>
                    </div>`)
                }
            }).fail(function (xhr, textStatus, errorThrown) {
                alert(errorThrown);
            });
        }


    }

})(jQuery);
