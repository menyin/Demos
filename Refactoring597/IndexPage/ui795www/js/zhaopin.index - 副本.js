/**
 * Created by Administrator on 2017/11/8.
 */
define(function (require, exports, module) {

    /*��һ�������� begin*/
        require('product.job-search')();
        require('common')();

        var jquery = $ = require('jquery'),
            popup = require('widge.popup'),
            cookie = require('tools.jquery.cookie');
        var trigger = $('#browser');
        p = new popup({
            idName: 'navBox panelBox',
            width: 550,
            height: 'auto',
            align: {
                baseElement: trigger,
                baseXY: ['-50%', '100%+10']
            }
        }),
            hideTimer=undefined,
            element = p.get('element');

        var nickName = cookie.get('nickname', {isDecode: true});
        var userType = cookie.get("userType");
        if (nickName) {
            if (userType == '1') {
                $('#user_menu_notlogin').hide();
                $('#com_menu_logined').hide();
                $('#user_menu_logined').show();
                $('#user_menu_logined').find('#user_menu_name').html(nickName);
            }
            if (userType == '2') {
                $('#user_menu_notlogin').hide();
                $('#com_menu_logined').show();
                $('#user_menu_logined').hide();
                $('#com_menu_logined').find('#com_menu_name').html(nickName);
            }
        }

//$('#currentCity').html(currentCity);

        $($('#boxNav').remove().html()).appendTo(element);
        trigger.on('mouseenter', enterHandle).on('mouseleave', leaveHandle);
        element.on('mouseenter', enterHandle).on('mouseleave', leaveHandle);

        function enterHandle() {
            hideTimer && clearTimeout(hideTimer);
            p.show();
        }

        function leaveHandle() {
            hideTimer && clearTimeout(hideTimer);
            hideTimer = setTimeout(function () {
                p.hide();
            }, 120);
        }


//ͷ������
        var defaultIndex = '2';
        defaultIndex = (defaultIndex == '') ? 2 : defaultIndex;
    var jobTopSearch = require('product.jobSearch.jobTopSearch');
        var search = new jobTopSearch({
            selectedIndex: defaultIndex,
            search: {
                width: 333
            },
            initDataSource: '',
            dataSource: [],
            url: [
//'/jobsearch/?key={query}',
//'/jobsearch/?params=u2&key={query}',
//'/salary/{query}/'
                '/zhaopin/c1/?q={{query}}',
                '/zhaopin/c2/?q={{query}}',
                '/zhaopin/c3/?q={{query}}'
//'/zhaopin/'
            ],
            placeHolder: [
                '������ְλ�ؼ���',
                '�����빫˾�ؼ���',
                '������ְλ��˾�ؼ���'
            ]
        });

        var searchInput = search.getSearch(),
            searchSelect = search.getSelect(),
            maxSize = 10;
        searchInput.on('itemAllDelete', function (e) {
            $.getJSON('/head/ClearSearchKeywords/?callback=?');
        });
        searchInput.on('itemDeleted', function (e) {
            $.getJSON('/head/DelSearchKeyword/?keyword=' + e.value + '&callback=?');
        });
        searchInput.on('searchItemSelected', function (e) {
//e.url������
//e.data.text�Ƕ�Ӧ������
//e.index��������
            var index = searchSelect.get('selectedIndex');
            window.location.href = e.url;
            /*
             if(e.url){
             $.getJSON('/head/SaveJobkey/?keyword='+e.data.text+'&callback=?',function(result){
             window.location.href = e.url;
             });
             }else {
             window.location.href = e.url;
             }
             */
        });
        searchInput.before('show', function () {
            this.setLevel(99);
            p.setLevel(98);
        });
        p.before('show', function () {
            this.setLevel(99);
            searchInput.setLevel(98);
        });

        search.on('submit', function (e) {
            window.location.href = e.url;
            /*
             if(e.index==0&&e.value) {
             $.getJSON('/head/SaveJobkey/?keyword='+e.value+'&callback=?',function(result){
             window.location.href = e.url;
             });
             }else {
             window.location.href = e.url;
             }
             */
        });


        $('#btns span').hover(function () {
            $(this).find('p').show();
        }, function () {
            $(this).find('p').hide();
        });
    /*��һ�������� end*/

    /**
     * �ڶ��������� �ص�topЧ����ʼ��
     */
    $(document).ready(function () {
        $(window).scroll(function () {
            if ($(document).scrollTop() > 120) {
                $('#sus').find('a.backTop').css({
                    'display': 'inline-block'
                });
            } else {
                $('#sus').find('a.backTop').css({
                    'display': 'none'
                });
            }
        });

        $('#sus').find('a.backTop').click(function () {
            $('html,body').animate({
                scrollTop: 0
            });
        });

        var searchWord = '?q=????';
        if (searchWord != '') {
            $('.search_box_a em').css('visibility', 'visible');
        }

        $('.search_box_a .searchInput #searchInput').keyup(function () {
            if ($(this).val() != '') {
                $('.search_box_a em').css('visibility', 'visible');
            } else {
                $('.search_box_a em').css('visibility', 'hidden');
            }
        });
        $('.search_box_a em').click(function () {
            $(this).closest('div').find('#searchInput').val('');
            $('.search_box_a em').css('visibility', 'hidden');
            $(this).closest('div').find('#searchInput').focus();
        })
    });


    /*������������ begin*/
    var jobSortActions = require('product.jobSortActions');//����ɸѡ���Ч��
    $.extend(require('jpjob.jobsort2'));
    $('#mutil_select_group').jobsort({
        target: "#mutil_select_group",
        type: "multiple",
        max: 5,
        hddName: 'hidJobsort',
        isLimit: true
    });
    $('#btnSubmitJobsort').click(function () {
        var $jobsort = $('#mutil_select_group').find('input[name="hidJobsort"]').val();
        if ($jobsort) {
            $('#hddJobsort').val('a' + $jobsort['replace'](/,/g, '_'));
        }
        $('#frmJobsort').get(0).submit();
    });
    $("#btnSubmitSalary").click(function () {
        var frm = $("#frmSalary"),
            txt1 = frm.find("[name='txtminSalary']"),
            txt2 = frm.find("[name='txtmaxSalary']");

        frm.find("[name='params']").val('e' + txt1.val() + "_" + txt2.val());
        txt1.remove();
        txt2.remove();
        frm.submit();
        return false;
    });

//xiaomi
    /*mj beign*/

//Ĭ������ ����
    $.extend($,require('product.jpCommon'));
    //$.extend($, m['product.jpCommon']);
    $(".simple_search_bar").textDefault();
    /*end*/
    /*������������ end*/

    /*���Ĳ������� begin*/
    //var $ = m['jquery'],
      var  CheckBoxer =require('widge.checkBoxer'), //�б�ѡ
        checkLogin = require('product.checkLogin'), //�ж��Ƿ��¼�����򵯳���
        verifier = require('module.verifier'),
        cookie = require('tools.jquery.cookie'),
        listBoxer = new CheckBoxer({
            className: "check-checked",
            hoverClassName: "check-hover",
            maxLength: 1000,
            element: $('#job_list_main').find('.pos')
        }),
        srlfun = $("#scrollFun");
//������
    require('tools.fixed').pin(srlfun, 0, 0, false, true);


//�ײ�����
    /*
     var bottomType = cookie.get('bottomType');
     var userType = cookie.get('userType');

     if(!bottomType&&userType!='per'){
     $('#listBottomBar').show();
     }

     $('#listBottomBar .bottom-bar-close').click(function(){
     cookie.set('bottomType', true,{expires:3});
     $('#listBottomBar').hide();
     });
     */
//��ע����
    var dialog = require('widge.overlay.jpDialog'),
        confirmBox = require('widge.overlay.confirmBox'),
        follower = new dialog({
            idName: 'follow_dialog',
            title: '��ӹ�ע',
            close: 'x',
            isAjax: true,
            initHeight: 100,
            width: 480
        });

    /*
     $('#shield').click(function(){
     var islogin = checkLogin.isLogin('ajaxshield');
     if(!islogin){
     return false;
     }
     });
     */
//�б�ѡ
    listBoxer.on('select', function (e) {
        var value = listBoxer.getValue(true)['pos'],
            leth = value && value.length;
        if (leth == undefined) leth = 0;
        /*
         if(leth){
         srlfun.show();
         } else {
         srlfun.hide();
         }
         */
        $(".batch_num").html(leth);
    });
//ȫѡ
    $('#select-all').click(function () {
        if ($(this).attr("checked")) {
            var i = 0;
            $('.firm-l .pos').each(function (index, value) {
                listBoxer.setStatus(index, true);
//$(this).addClass('check-checked');
//$(this).attr('data-status',true);
                i++;
            });
            $(".batch_num").html(i);
        } else {
            $('.firm-l .pos').each(function (index, value) {
                listBoxer.setStatus(index, false);
            });
            $(".batch_num").html('0');
        }
    });

//ְҵԤ����
    /*
     new m['product.jobList.jobPostipGroup']({
     container:$("#job_list_table, #firm_box"),
     width:670
     });
     */
    $('.hb_ui_jobPostip').eq(0).on('click', '.btnApply', function () {
        var jobid = $(this).attr('data-value');
        $.getJSON('/api/web/job.api?act=join&jid=' + jobid, function (result) {
            if (result.status == -1) {
                checkLogin.isLogin('ajaxLoginCallback');
                checkLogin.dialog.resetSize(498);
                return false;
            }
            if (result.status < 1) {
                confirmBox.timeBomb(result.msg, 'fail');
                return false;
            }
            if (result.status >= 1) {
                confirmBox.timeBomb(result.msg, 'success').resetSize('auto');
                return false;
            }
        });
    });

    var posValue;

//����Ͷ��
    $('#btnApplyJob,#btnApply1').click(function (e) {
        var arr = new Array();
        $(".firm-l .check-checked").each(function () {
            arr.push($(this).attr('data-value'));
        });
        var str = arr.join(",");
        if (str == "") {
            confirmBox.timeBomb("��ѡ��ְλ", {
                name: "warning",
                timeout: 1000
            });
            return false;
        }


        $.ajax({
            url: "/api/web/job.api",
            type: "get",
            data: {
                act: 'join',
                str: str
            },
            dataType: "json",
            beforeSend: function () {
                $('#loadBox').show();
            },
            success: function (json) {
                $('#loadBox').hide();
                if (json.status == -1) {
                    checkLogin.isLogin('ajaxLoginCallback');
                    checkLogin.dialog.resetSize(498);
                    return false;
                }
                if (json.status == 1) {
                    confirmBox.timeBomb('ְλͶ�ݳɹ�', 'success').resetSize('auto');
                    window.location.href = window.location.href;
                } else {
                    confirmBox.timeBomb(json.msg, 'fail').resetSize('auto');
                }
            }
        });
    });

//�����ղ�
    $('#btnFavJob,#btnFav').on('click', function () {
        var arr = new Array();
        $(".firm-l .check-checked").each(function () {
            arr.push($(this).attr('data-value'));
        });
        var str = arr.join(",");
        if (str == "") {
            confirmBox.timeBomb("��ѡ��ְλ", {
                name: "warning",
                timeout: 1000
            });
            return false;
        }

        $.ajax({
            url: "/api/web/job.api",
            type: "get",
            data: {
                act: 'favorites',
                str: str
            },
            dataType: "json",
            beforeSend: function () {
                $('#loadBox').show();
            },
            success: function (json) {
                $('#loadBox').hide();
                if (json.status == -1) {
                    checkLogin.isLogin('ajaxLoginCallback');
                    checkLogin.dialog.resetSize(498);
                    return false;
                }
                if (json.status == 1) {
                    confirmBox.timeBomb('ְλ�ղسɹ�', 'success').resetSize('auto');
                } else {
                    confirmBox.timeBomb('ְλ�ղ�ʧ��', 'fail').resetSize('auto');
                }
            }
        });

    });

    $('.firm_box').find('.firm-bot').find('#btnApply').click(function () {
        var jobid = $(this).attr('rel');
        $.getJSON('/api/web/job.api?act=join&jid=' + jobid, function (result) {
            if (result.status == -1) {
                var url = '/person/applyLogin.htm';
                checkLogin.dialog.setContent(url).show().off('loadComplete').on('loadComplete', function () {
                    this.oneCloseEvent('#btnApplyClose');
                });
                return false;
            }
            if (result.status < 1) {
                confirmBox.timeBomb(data.error, 'fail');
                return false;
            }
            if (result.status >= 1) {
                confirmBox.timeBomb(result.msg, 'success').resetSize('auto');
                return false;
            }
        });
    });

    $('.firm_box').find('.firm-bot').find('#btnFavorites').click(function () {
        var jobid = $(this).attr('rel');
        $.getJSON('/api/web/job.api?act=favorites&jid=' + jobid, function (data) {
            if (data && data.status) {
                if (data.status == -1) {
                    var url = '/person/applyLogin.htm';
                    checkLogin.dialog.setContent(url).show().off('loadComplete').on('loadComplete', function () {
                        this.oneCloseEvent('#btnFavoritesClose');
                    });
                    return false;
                }
                if (data.status < 0) {
                    confirmBox.timeBomb('ְλ�ղ�ʧ��', 'fail');
                    return false;
                }
                if (data.status == 1) {
                    confirmBox.timeBomb('ְλ�ղسɹ�', 'success').resetSize('auto');
                    return false;
                }
                if (data.status == 2) {
                    confirmBox.timeBomb('��ְλ�Ѿ����ղع�', 'success').resetSize('auto');
                    return false;
                }
            }
        });
    });

    $(".allResume").on("click", function () {
        $(this).addClass("hide").siblings(".allResume").removeClass("hide");
        $(this).closest(".postIntro").find(".more").toggleClass("hidden");
    });

    $('.zwPost').click(function () {
        $('.zwPost i').toggleClass('cut');
        if ($('.zwPost i').hasClass('cut'))
            window.location.href = $(this).attr("data-urgent-src");
        else
            window.location.href = $(this).attr("data-src");
    });
    /*���Ĳ������� end*/

    /*���岿������ begin*/
    var job = new require('product.jobMenu')({
        menuGroup: {
            url: {
                host: 'http://xm.597.com',
                path: '/zhaopin/',
                param: "q=????",
                alias: 'alias',
                selectId: []
            }
        }
    });
    /*���岿������ end*/

    /*������������ begin*/
    function ajaxLoginCallback() {
        window.location.href = window.location.href;
    }
    function ajaxshield() {
        window.location.href = document.getElementById("shield").href;
    }


    $(".filter_bottom .filter_menu ul li a,.one_sort ul li a").click(function () {
        var rel = ($(this).attr("rel"));
        var data_type = $(".one_sort").attr("data-type");
        if (rel && data_type == 1) {
            window.location.href = rel;
        }
    });

    $(".filter_bottom .filter_menu .normal_list a").click(function () {
        var rel = ($(this).attr("rel"));
        if (rel) {
            window.location.href = rel;
        }
    });

    // �µ�ְλɸѡ
    $('#searchFilter').hover(function () {
        $(this).addClass(' side_menu_click').find('ul').show();
        $('.filterList li').each(function () {
            if ($(this).text() === $('#filterKey').text()) {
                $(this).hide().siblings().show();
            }
        });
    }, function () {
        $(this).removeClass(' side_menu_click').find('ul').hide();
    });

    $('.filterList li').click(function () {
        $('#filterKey').html($(this).text());
        $(this).parent().hide();
        $('#searchFilter').attr('data-value', $(this).attr('data-value'));
    }).eq(0).click();

    $('#btnStreetSearch').click(function () {
        $('#btnKeywordSearch').trigger("click");
    })

    $('#filterKey').html('ȫ��');
    $('#searchFilter').attr('data-value', 3);

    $('#btnKeywordSearch').click(function () {
        var dataVal = $('#searchFilter').attr('data-value');
        var key = encodeURIComponent($(this).siblings('.key').val());
        var url = '/zhaopin/g3502c' + dataVal + '/';
        var address = $('#txtAddress').val();
        var addressQuery = '&txtAddress=' + address;

        window.location.href = url + '?q=' + key + addressQuery;
        return false;
    });
    /*������������ end*/
});

