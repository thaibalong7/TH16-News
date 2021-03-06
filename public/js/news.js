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

    const toStringDate = (date) => {
        // return arr_days_of_week[date.getDay()] + ', ' + date.getDate() + ' Thg ' + (date.getMonth() + 1) + ' ' + date.getFullYear();
        return date.getDate() + ' Thg ' + (date.getMonth() + 1) + ' ' + date.getFullYear();
    }


    if (location.pathname.includes("/news")) {
        const news_post = $('#news-content');
        const post_comment = $("#post-comments");
        if (news_post) {
            $.ajax("/api/news/getNewsById/" + news_post.attr('params'), {
                type: 'GET',
                dataType: 'json',
            }).done(news => {
                window.scrollTo(0, 0);
                news_post.append(news.data.content);
                document.title = news.data.title;
                const news_avatar = $('#news-avatar');
                const news_title = $('#news-title');
                const news_publicAt = $('#news-publicAt');
                const news_view = $('#news-view');
                news_avatar.append(`<img src="/img/news_avatar/${news.data.avatar}" >`);
                news_title.append(`<h3>${news.data.title}<\h3>`)
                news_publicAt.append(`<p><i class="fa fa-clock-o"></i> ${toStringDate(new Date(news.data.publicAt))}</p>`)
                news_view.append(`<p><i class="fa fa-eye"></i> ${news.data.view}</p>`)
                $.ajax("/api/news/increaseView/" + news_post.attr('params'), { //tăng view cho bài viết
                    type: 'GET',
                    dataType: 'json',
                });

                //get comments
                $.ajax("/api/news/getCommentByNews/" + news.data.id + "?per_page=" + post_comment.attr("per_page") + "&page=" + post_comment.attr("next_page"),
                    {
                        type: 'GET',
                        dataType: 'json',
                    }).done(function (comments) {
                        if (comments.next_page > 0) //còn data
                        {
                            $("#view-more-cmt-container").show();
                            $("#loading-comment-container").hide();
                            post_comment.attr("next_page", comments.next_page)
                        }
                        else {
                            $("#loading-comment-container").hide();
                        }
                        for (let i = 0, l = comments.data.length; i < l; i++) {
                            post_comment.append(` <div class="media">
                            <div class="media-left">
                                <img class="media-object" src="/img/avatar.png" alt="">
                            </div>
                            <div class="media-body">
                                <div class="media-heading">
                                    <h4>${comments.data[i].name}</h4>
                                    <span class="time">${comments.data[i].createdAt}</span>
                                </div>
                                <p>${comments.data[i].content}</p>
                            </div>
                        </div>`)
                        }
                    }).fail(function (xhr, textStatus, errorThrown) {
                        alert(errorThrown);
                    });


                //load more cmt
                $("#btn-view-more-cmt").click(function () {
                    $("#view-more-cmt-container").hide();
                    $("#loading-comment-container").show();

                    $.ajax("/api/news/getCommentByNews/" + news.data.id + "?per_page=" + post_comment.attr("per_page") + "&page=" + post_comment.attr("next_page"),
                        {
                            type: 'GET',
                            dataType: 'json',
                        }).done(function (comments) {
                            if (parseInt(comments.next_page) > 0) {
                                $("#view-more-cmt-container").show();
                                post_comment.attr("next_page", comments.next_page)
                                $("#loading-comment-container").hide();
                            }
                            else {
                                $("#loading-comment-container").hide();
                            }
                            for (let i = 0, l = comments.data.length; i < l; i++) {
                                post_comment.append(` <div class="media">
                            <div class="media-left">
                                <img class="media-object" src="/img/avatar.png" alt="">
                            </div>
                            <div class="media-body">
                                <div class="media-heading">
                                    <h4>${comments.data[i].name}</h4>
                                    <span class="time">${comments.data[i].createdAt}</span>
                                </div>
                                <p>${comments.data[i].content}</p>
                            </div>
                        </div>`)
                            }

                        }).fail(function (xhr, textStatus, errorThrown) {
                            alert(errorThrown);
                        });

                })

            }).fail(function (xhr, textStatus, errorThrown) {
                alert(xhr.responseText);
            });
        }

        const post_widget_same_category = $('#post-widget-same-category');
        if (post_widget_same_category) {
            $.ajax("/api/news/getLatestNewsByIdNews/" + post_widget_same_category.attr('idNews'), {
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
            const ul_tags_news = $('#ul-tags-news');
            if (ul_tags_news) {
                $.ajax("/api/news/getTagsByNews/" + post_widget_same_category.attr('idNews'), {
                    type: 'GET',
                    dataType: 'json',
                }).done((_tags_new) => {
                    for (let i = 0, l = _tags_new.data.length; i < l; i++) {
                        ul_tags_news.append(`<li><a href="${_tags_new.data[i].tag.link}">${_tags_new.data[i].tag.name}</a></li>`)
                    }
                }).fail(function (xhr, textStatus, errorThrown) {
                    alert(errorThrown);
                });
            }

        }

    }


})(jQuery);