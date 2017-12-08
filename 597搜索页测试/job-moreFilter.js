/**
 * Created by PC on 2017/12/7.
 */
/*筛选相关效果*/
jpjs.use('@jpCommon, @jobsort2, @jobSortActions', function(m){

    var $ = m['jpjob.jobsort2'];
    $('#mutil_select_group').jobsort({target:"#mutil_select_group",type:"multiple",max:5,hddName:'hidJobsort',isLimit:true});
    $('#btnSubmitJobsort').click(function(){
        var $jobsort = $('#mutil_select_group').find('input[name="hidJobsort"]').val();
        if($jobsort){
            $('#hddJobsort').val('a'+ $jobsort.replace(/,/g,'_'));
        }
        $('#frmJobsort').get(0).submit();
    });
    $("#btnSubmitSalary").click(function(){
        var frm = $("#frmSalary"),
            txt1 = frm.find("[name='txtminSalary']"),
            txt2 = frm.find("[name='txtmaxSalary']");

        frm.find("[name='params']").val('e'+txt1.val()+"_"+txt2.val());
        txt1.remove();txt2.remove();
        frm.submit();
        return false;
    });

    //xiaomi
    /*mj beign*/

    //默认文字 搜索
    $.extend($, m['product.jpCommon']);
    $(".simple_search_bar").textDefault();
    /*end*/

});