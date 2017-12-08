/**
 * Created by PC on 2017/12/7.
 */
/*�����ϵ�Ч��*/
jpjs.use('@checkLogin, @verifier, @checkBoxer, @confirmBox, @form, @changeClass, @jobPostipGroup', function(m){
    var $ = m['jquery'],
        CheckBoxer = m['widge.checkBoxer'], //�б�ѡ
        checkLogin = m['product.checkLogin'], //�ж��Ƿ��¼�����򵯳���
        verifier = m['module.verifier'],
        cookie = m['tools.cookie'],
        listBoxer = new CheckBoxer({
            className : "check-checked",
            hoverClassName:"check-hover",
            maxLength:1000,
            element: $('#job_list_main').find('.pos')
        }),
        srlfun = $("#scrollFun");
    //������
    m['tools.fixed'].pin(srlfun, 0, 0, false, true);


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
    var dialog = m['widge.overlay.jpDialog'],
        confirmBox = m['widge.overlay.confirmBox'],
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
    listBoxer.on('select', function(e){
        var value = listBoxer.getValue(true)['pos'],
            leth = value && value.length;
        if(leth==undefined) leth=0;
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
    $('#select-all').click(function(){
        if ($(this).attr("checked")) {
            var i=0;
            $('.firm-l .pos').each(function(index,value){
                listBoxer.setStatus(index,true);
                //$(this).addClass('check-checked');
                //$(this).attr('data-status',true);
                i++;
            });
            $(".batch_num").html(i);
        } else {
            $('.firm-l .pos').each(function(index,value){
                listBoxer.setStatus(index,false);
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
    $('.hb_ui_jobPostip').eq(0).on('click', '.btnApply', function(){
        var jobid=$(this).attr('data-value');
        $.getJSON('/api/web/job.api?act=join&jid='+jobid,function(result){
            if (result.status==-1){
                checkLogin.isLogin('ajaxLoginCallback');
                checkLogin.dialog.resetSize(498);
                return false;
            }
            if (result.status<1){
                confirmBox.timeBomb(result.msg, 'fail');
                return false;
            }
            if (result.status>=1){
                confirmBox.timeBomb(result.msg, 'success').resetSize('auto');
                return false;
            }
        });
    });

    var posValue;

    //����Ͷ��
    $('#btnApplyJob,#btnApply1').click(function(e){
        var arr = new Array();
        $(".firm-l .check-checked").each(function(){
            arr.push($(this).attr('data-value'));
        });
        var str=arr.join(",");
        if(str==""){
            confirmBox.timeBomb("��ѡ��ְλ", {
                name : "warning",
                timeout : 1000
            });
            return false;
        }


        $.ajax({
            url : "/api/web/job.api",
            type : "get",
            data : {
                act : 'join',
                str : str
            },
            dataType : "json",
            beforeSend : function(){
                $('#loadBox').show();
            },
            success : function(json) {
                $('#loadBox').hide();
                if(json.status==-1){
                    checkLogin.isLogin('ajaxLoginCallback');
                    checkLogin.dialog.resetSize(498);
                    return false;
                }
                if(json.status==1){
                    confirmBox.timeBomb('ְλͶ�ݳɹ�', 'success').resetSize('auto');
                    window.location.href = window.location.href;
                }else{
                    confirmBox.timeBomb(json.msg, 'fail').resetSize('auto');
                }
            }
        });
    });

    //�����ղ�
    $('#btnFavJob,#btnFav').on('click', function(){
        var arr = new Array();
        $(".firm-l .check-checked").each(function(){
            arr.push($(this).attr('data-value'));
        });
        var str=arr.join(",");
        if(str==""){
            confirmBox.timeBomb("��ѡ��ְλ", {
                name : "warning",
                timeout : 1000
            });
            return false;
        }

        $.ajax({
            url : "/api/web/job.api",
            type : "get",
            data : {
                act : 'favorites',
                str : str
            },
            dataType : "json",
            beforeSend : function(){
                $('#loadBox').show();
            },
            success : function(json) {
                $('#loadBox').hide();
                if(json.status==-1){
                    checkLogin.isLogin('ajaxLoginCallback');
                    checkLogin.dialog.resetSize(498);
                    return false;
                }
                if(json.status==1){
                    confirmBox.timeBomb('ְλ�ղسɹ�', 'success').resetSize('auto');
                }else{
                    confirmBox.timeBomb('ְλ�ղ�ʧ��', 'fail').resetSize('auto');
                }
            }
        });

    });

    $('.firm_box').find('.firm-bot').find('#btnApply').click(function(){
        var jobid=$(this).attr('rel');
        $.getJSON('/api/web/job.api?act=join&jid='+jobid,function(result){
            if (result.status==-1){
                var url = '/person/applyLogin.htm';
                checkLogin.dialog.setContent(url).show().off('loadComplete').on('loadComplete',function(){
                    this.oneCloseEvent('#btnApplyClose');
                });
                return false;
            }
            if (result.status<1){
                confirmBox.timeBomb(data.error, 'fail');
                return false;
            }
            if (result.status>=1){
                confirmBox.timeBomb(result.msg, 'success').resetSize('auto');
                return false;
            }
        });
    });

    $('.firm_box').find('.firm-bot').find('#btnFavorites').click(function(){
        var jobid=$(this).attr('rel');
        $.getJSON('/api/web/job.api?act=favorites&jid='+jobid, function(data) {
            if (data && data.status) {
                if (data.status==-1){
                    var url = '/person/applyLogin.htm';
                    checkLogin.dialog.setContent(url).show().off('loadComplete').on('loadComplete',function(){
                        this.oneCloseEvent('#btnFavoritesClose');
                    });
                    return false;
                }
                if (data.status<0){
                    confirmBox.timeBomb('ְλ�ղ�ʧ��', 'fail');
                    return false;
                }
                if (data.status==1){
                    confirmBox.timeBomb('ְλ�ղسɹ�', 'success').resetSize('auto');
                    return false;
                }
                if (data.status==2){
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

    $('.zwPost').click(function(){
        $('.zwPost i').toggleClass('cut');
        if ($('.zwPost i').hasClass('cut'))
            window.location.href = $(this).attr("data-urgent-src");
        else
            window.location.href = $(this).attr("data-src");
    });
});

//���˵�
/*	jpjs.use('@jobMenu', function(m){
 var job = new m['product.jobMenu']({
 menuGroup: {
 url: {
 host: '{$url}',
 path: '/zhaopin/',
 param:"q={$_GET['keyword']}",
 alias: 'alias',
 selectId: []}
 }
 });
 });*/

function ajaxLoginCallback() {
    window.location.href = window.location.href ;
}
function ajaxshield(){
    window.location.href = document.getElementById("shield").href;
}


$(".filter_bottom .filter_menu ul li a,.one_sort ul li a").click(function(){
    var rel = ($(this).attr("rel"));
    var data_type = $(".one_sort").attr("data-type");
    if(rel&&data_type==1){
        window.location.href = rel;
    }
});

$(".filter_bottom .filter_menu .normal_list a").click(function(){
    var rel = ($(this).attr("rel"));
    if(rel){
        window.location.href = rel;
    }
});

// �µ�ְλɸѡ
$('#searchFilter').hover(function() {
    $(this).addClass(' side_menu_click').find('ul').show();
    $('.filterList li').each(function(){
        if($(this).text() === $('#filterKey').text()){
            $(this).hide().siblings().show();
        }
    });
}, function() {
    $(this).removeClass(' side_menu_click').find('ul').hide();
});

$('.filterList li').click(function(){
    $('#filterKey').html($(this).text());
    $(this).parent().hide();
    $('#searchFilter').attr('data-value',$(this).attr('data-value'));
}).eq(0).click();

$('#btnStreetSearch').click(function(){
    $('#btnKeywordSearch').trigger("click");
})

/*$('#filterKey').html(<!--{if $query['condition']==1}-->'ְλ'<!--{/if}--><!--{if $query['condition']==2}-->'��˾'<!--{/if}--><!--{if $query['condition']==3}-->'ȫ��'<!--{/if}-->);*/
/*$('#searchFilter').attr('data-value',{$query['condition']});*/

$('#btnKeywordSearch').click(function(){
    var dataVal = $('#searchFilter').attr('data-value');
    var key = encodeURIComponent($(this).siblings('.key').val());
    var url = '/zhaopin/{$conditionUrl}c'+dataVal+'/';
    var address = $('#txtAddress').val();
    var addressQuery = '&txtAddress='+address;

    window.location.href = url + '?q=' + key + addressQuery;
    return false;
});