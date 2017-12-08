<?exit?>
<!doctype html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="mobile-agent" content="format=xhtml; url=http://m.{ROOT_DOMAIN}{$_SERVER['REQUEST_URI']}">
	<meta name="mobile-agent" content="format=html5; url=http://m.{ROOT_DOMAIN}{$_SERVER['REQUEST_URI']}">
	<meta name="mobile-agent" content="format=wml; url=http://m.{ROOT_DOMAIN}{$_SERVER['REQUEST_URI']}">
	<meta name="keywords" content="{$keywords}" />
	<meta name="description" content="{$description}" />
	<title>{$title}</title>
	<link rel="stylesheet" type="text/css" href="http://cdn.{ROOT_DOMAIN}/css/search_main.css?v=2" />
	<style type="text/css">
		.search_box_a .searchInput { width: 300px; padding: 0 5px; }
		.search_box_a button {display: inline;background: #DD100D;color: #fff;font-weight: bold;font-size: 14px;width: 70px;float: right;
			border: none;margin-top: -20px;}
	</style>
	<script type="text/javascript" language="javascript" src="http://cdn.{ROOT_DOMAIN}/js/jquery-1.8.3.min.js?v=20140312"></script>
	<!--搜索相关效果-->
	<script type="text/javascript" language="javascript" src="http://cdn.{ROOT_DOMAIN}/js/job-search.js"></script>
	<!--回到顶部效果-->
	<script type="text/javascript" language="javascript" src="http://cdn.{ROOT_DOMAIN}/js/job-backTop.js"></script>
	<!--更多筛选相关效果-->
	<script type="text/javascript" language="javascript" src="http://cdn.{ROOT_DOMAIN}/js/job-moreFilter.js"></script>
	<!--操作相关效果-->
	<script type="text/javascript" language="javascript" src="http://cdn.{ROOT_DOMAIN}/js/job-oprations.js"></script>
</head>
<body class="job">
<!--{template top}-->
<div class="job_main mgb20">
	<div id="job_filter_box" class="job_filter_box mgb10 mgt15">
		<div class="job_nav">
			<div id="side_menu" class="side_menu" style="display:none;">
				<a class="title" href="javascript:"><i class="more-type" title="点击显示"></i>全部职位类别</a>
				<div class="side_menu_container">
					<div class="side_menu_list">
						<div class="loader"></div>
						<div class="side_menu_list_cont">
							<!--
                                <div class="actions">
                                    <a id="mutil_btn" class="multi" href="javascript:">多选<i class="jpFntWes">&#xf067;</i></a><a href="">全选</a>
                                </div>
                            -->
							<ul></ul>
						</div>
					</div>
					<div class="mutil_select_group" style="display:none">
						<div class="group-box clearfix" id="mutil_select_group" ></div>
						<div class="actions">
							<form action="" method="get" id="frmJobsort">
								<input type="hidden" name="key" value="">
								<input type="hidden" name="v" id="hddJobsort">
							</form>
							<button class="button_a button_a_red" id="btnSubmitJobsort">确定</button>
							<button class="button_a" id="cancel_btn">取消</button>
						</div>
					</div>
				</div>
			</div>
			<!--
            <a id="followBtn" class="followBtn" href="javascript:"><i class="jpFntWes">&#xf004;</i>加关注</a>
            -->

			<div id="searchFilter" class="side_menu" data-value="{$query['condition']}">
				<a class="title" href="javascript:"><i class="jpFntWes"></i><em id="filterKey"><!--{if $query['condition']==1}-->'职位'<!--{/if}--><!--{if $query['condition']==2}-->'公司'<!--{/if}--><!--{if $query['condition']==3}-->'全文'<!--{/if}--></em></a>
				<ul class="filterList">
					<li data-value="1">职位</li>
					<li data-value="2">公司</li>
					<li data-value="3">全文</li>
				</ul>
			</div>

			<!-- 职位搜索->-->
			<div class="side_nav">
				<!--{if $query['jobsort']}-->&nbsp;<a class="label" href="/{$_city}{$searchName}/{$jobsortUrl}<!--{if $jobsortUrl}-->/<!--{/if}-->{$keyword}" title="{$jobsortStr}" style="display:none;">职位类别：<font>{$jobsortStr} ×</font></a>&nbsp;<!--{/if}-->
				<div class="simple_search_bar">
					<form action="{$thisPath}" id="frmKeywordSearch" method="get">
						<button class="jpFntWes" type="submit" id="btnKeywordSearch">搜索</button>
						<!-- <button class="jpFntWes" type="submit" id="btnKeywordSearch">&#xf002;</button> -->
						<span class="def-text" style="display:none">在结果中搜索</span>
						<input type="text" name="q" class="key" value="{$query['keyword']}" />
						<!--<input type="hidden" id="conditionStr" name="param" value="{$areaUrl}" />-->
					</form>
					<span class="splitLine"></span>
				</div>
			</div>

			<!-- 街道搜索 -->
			<div class="side_nav">
				<span class="streetSpan">街道：</span>
				<div class="simple_search_bar" >
					<button class="jpFntWes" type="submit" id="btnStreetSearch">筛选</button>
					<input type="text" id="txtAddress" name="txtAddress" class="key" value="{$query['txtAddress']}" />
					<span class="splitLine"></span>
				</div>
			</div>
		</div>
		<div id="side_menu_items" class="side_menu_items">
			<div class="side_menu_items_arrow"></div>
		</div>
		<table cellpadding="0">
			<tr class="jobadd">
				<th>工作地点</th>
				<td style="padding-top:9px;">
					<div class="one_sort" data-type="1">

						<div class="actions">
							<a class="mutil" href="javascript:">多选<i class="jpFntWes">&#xf067;</i></a>
						</div>

						<ul>
							<!--{if $regionAllCity}-->
							<li >
								<a class="first<!--{if $regionAllCity[region_id]==$query['area']}--> dft_checked cur<!--{/if}-->" href="javascript:void(0);" rel="{$regionAllCity['region_domain']}/{$searchName}/g{$regionAllCity[region_id]}{$areaUrl}/{$keyword}">{$regionAllCity[region_name]}</a>
							</li>
							<!--{/if}-->
							<!--{loop $topRegion $l}-->
							<li >
								<a class="<!--{if in_array($l['region_id'],$queryAreaArr)}-->dft_checked cur<!--{/if}-->" href="javascript:void(0);" rel="/{$searchName}/g{$l['region_id']}{$areaUrl}/{$keyword}" data-value="{$l['region_id']}">{$l['region_name_short']}</a>
								<!--{/loop}-->
							</li>
						</ul>
					</div>
					<div class="actions-oper">
						<form action="{$areaPath}" method="get" id="frmArea">
							<!--{if $query['keyword']}-->
							<input type="hidden" name="q" value="{$query['keyword']}" />
							<!--{/if}-->
							<input type="hidden" name="n" id="hddArea" class="many-hidden" type-value="g" value="{$query['area']}">

							<button class="button_a button_a_red" id="btnSubmitArea" data-type="submit">确定</button>
							<button type="button" class="button_a resetbtn" id="btnResetArea" data-type="remove" >清除</button>
							<button type="button" class="button_a cancelbtn" id="btnCancelArea" data-type="cancel">取消</button>
						</form>
					</div>
				</td>
			</tr>
			<tr class="first">
				<th>招聘行业</th>
				<td>
					<div class="one_sort">
						<!--
                        <div class="actions">
                            <a class="more" href="#"><i class="jpFntWes">&#xf0d7;</i></a>
                            <a class="mutil" href="javascript:">多选<i class="jpFntWes">&#xf067;</i></a>
                        </div>
                        -->
						<ul>
							<li class="first">
								<a class="sub_link <!--{if !$topCalling}-->dft_checked cur<!--{/if}-->" href="javascript:void(0);" rel="/{$searchName}/{$callingUrl}/{$keyword}">不限</a>
							</li>
							<!--{loop $industryList $l}-->
							<li <!--{if $topCalling==$l['calling_id']}-->class="current"<!--{/if}-->>
							<a class="sub_link <!--{if $query['calling']==$l['calling_id']}-->cur<!--{/if}-->" href="javascript:void(0);" rel="/{$searchName}/h{$l['calling_id']}{$callingUrl}/{$keyword}" data-value="{$l['calling_id']}">{$l['calling_name']}</a>
							<div class="sub_sort">
								<a class="first " href="javascript:void(0);" rel="/{$searchName}/h{$l['calling_id']}{$callingUrl}/{$keyword}">全部</a>
								<!--{loop $l['subItems'] $list}-->
								<a class="<!--{if $bottomCalling==$list['calling_id']}-->dft_checked cur<!--{/if}-->" href="javascript:void(0);" rel="/{$searchName}/h{$list['calling_id']}{$callingUrl}/{$keyword}" data-value="{$list['calling_id']}">{$list['calling_name']}</a>
								<!--{/loop}-->
							</div>
							</li>
							<!--{/loop}-->

						</ul>
					</div>
					<!--
                    <div class="actions-oper">
                        <form action="/renliziyuan/" method="get" id="frmCalling">
                        <input type="hidden" name="v" id="hddcallingid" class="many-hidden" type-value="c">
                            <button class="button_a button_a_red" id="btnSubmitCalling" type="button" data-type="submit">确定</button>
                            <button type="button" class="button_a resetbtn" id="btnResetCalling" data-type="remove">清除</button>
                            <button type="button" class="button_a cancelbtn" id="btnCancelCalling" data-type="cancel">取消</button>
                        </form>
                    </div>
                    -->
				</td>
			</tr>
			<!--{if $other_keyword}-->
			<tr class="first">
				<th>相关职位</th>
				<td>
					<div class="one_sort">
						<ul>
							<!--{loop $other_keyword $l}-->
							<li >
								<a class="sub_link" href="javascript:void(0);" rel="/{$searchName}/?q={$l}">{$l}</a>
							</li>
							<!--{/loop}-->
						</ul>
					</div>
				</td>
			</tr>
			<!--{/if}-->
			<tr class="filter_bottom">
				<th>更多筛选</th>
				<td>
					<div id="filter_group" class="filter_group">
						<div class="filter_menu">
							<a class="sub_filter <!--{if $minSalary||$maxSalary}-->dft_checked cur<!--{/if}-->" href="javascript:">薪资范围<i class="jpFntWes n">&#xf107;</i><i class="jpFntWes c">&#xf106;</i><s class="hr"></s></a>
							<ul class="filter_options price_list">
								<li><a href="javascript:void(0);" rel="/{$searchName}/{$salaryUrl}<!--{if $salaryUrl}-->/<!--{/if}-->{$keyword}">不限</a></li>
								<li><a href="javascript:void(0);" rel="/{$searchName}/n1500{$salaryUrl}/{$keyword}" class="<!--{if $showSalary==1}-->dft_checked cur<!--{/if}-->">1500以下</a></li>
								<li><a href="javascript:void(0);" rel="/{$searchName}/m1500n2500{$salaryUrl}/{$keyword}" class="<!--{if $showSalary==2}-->dft_checked cur<!--{/if}-->">1500-2500</a></li>
								<li><a href="javascript:void(0);" rel="/{$searchName}/m2500n3500{$salaryUrl}/{$keyword}" class="<!--{if $showSalary==3}-->dft_checked cur<!--{/if}-->">2500-3500</a></li>
								<li><a href="javascript:void(0);" rel="/{$searchName}/m3500n5000{$salaryUrl}/{$keyword}" class="<!--{if $showSalary==4}-->dft_checked cur<!--{/if}-->">3500-5000</a></li>
								<li><a href="javascript:void(0);" rel="/{$searchName}/m5000n7000{$salaryUrl}/{$keyword}" class="<!--{if $showSalary==5}-->dft_checked cur<!--{/if}-->">5000-7000</a></li>
								<li><a href="javascript:void(0);" rel="/{$searchName}/m7000n9000{$salaryUrl}/{$keyword}" class="<!--{if $showSalary==6}-->dft_checked cur<!--{/if}-->">7000-9000</a></li>
								<li><a href="javascript:void(0);" rel="/{$searchName}/m9000n12000{$salaryUrl}/{$keyword}" class="<!--{if $showSalary==7}-->dft_checked cur<!--{/if}-->">9000-12000</a></li>
								<li><a href="javascript:void(0);" rel="/{$searchName}/m12000n15000{$salaryUrl}/{$keyword}" class="<!--{if $showSalary==8}-->dft_checked cur<!--{/if}-->">12000-15000</a></li>
								<li><a href="javascript:void(0);" rel="/{$searchName}/m15000{$salaryUrl}/{$keyword}" class="<!--{if $showSalary==9}-->dft_checked cur<!--{/if}-->">15000以上</a></li>
								<li class="price_group">
									<form action="/zhaopin/" method="get" id="frmSalary">
										<input type="text" name="m" value="<!--{if $showSalary==-1}-->{$minSalary}<!--{/if}-->" />-<input type="text" name="n" value="<!--{if $showSalary==-1}-->{$maxSalary}<!--{/if}-->" />
										<input type="hidden" id="conditionStr" name="param" value="{$areaUrl}g{$query['area']}" />
										<input type="hidden" id="conditionStr" name="q" value="{$query['keyword']}" />
										<button class="button_a button_a_red" id="btnSubmitSalary">确定</button>
									</form>
								</li>
							</ul>
						</div>
						<div class="filter_menu">
							<a class="sub_filter <!--{if $query['ComProperty']}-->dft_checked cur<!--{/if}-->" href="javascript:">公司性质<i class="jpFntWes n">&#xf107;</i><i class="jpFntWes c">&#xf106;</i><s class="hr"></s></a>
							<div class="filter_options">
								<div class="normal_list">
									<!--<a class="mutil" href="javascript:">多选<i class="jpFntWes">&#xf067;</i></a>-->
									<a href="javascript:void(0)" rel="/{$searchName}/{$propertyUrl}<!--{if $propertyUrl}-->/<!--{/if}-->{$keyword}" class="hide">不限</a>
									<!--{loop $__comProperty $k $l}-->
									<a href="javascript:void(0)" rel="/{$searchName}/p{$k}{$propertyUrl}/{$keyword}" class="<!--{if $k==$query['ComProperty']}-->dft_checked cur<!--{/if}-->" data-value="{$k}">{$l}</a>
									<!--{/loop}-->
								</div>
								<!--
                                <div class="actions-oper">
                                  <form action="/renliziyuan/" method="get" id="frmComproperty">
                                    <input type="hidden" name="v" id="hddComproperty" class="many-hidden" type-value="g">
                                    <button class="button_a button_a_red" id="btnSubmitComproperty" data-type="submit" type="submit">确定</button>
                                    <button class="button_a resetbtn" type="button" id="btnResetComproperty" data-type="remove">清除</button>
                                    <button class="button_a cancelbtn" type="button" id="btnCancelComproperty" data-type="cancel">取消</button>
                                  </form>
                               </div>
                               -->
							</div>
						</div>
						<!--
                        <div class="filter_menu">
                            <a class="sub_filter " href="javascript:">岗位级别<i class="jpFntWes n">&#xf107;</i><i class="jpFntWes c">&#xf106;</i><s class="hr"></s></a>
                            <div class="filter_options">
                                <div class="normal_list">
                                    <a class="mutil" href="javascript:">多选<i class="jpFntWes">&#xf067;</i></a>
                                    <a class=" hide" href="/renliziyuan/">不限</a>
                                    <a href="/renliziyuan/f01/"  data-value="01">实习/见习</a>
                                    <a href="/renliziyuan/f02/"  data-value="02">普通员工</a>
                                    <a href="/renliziyuan/f03/"  data-value="03">高级/资深（非管理岗）</a>
                                    <a href="/renliziyuan/f04/"  data-value="04">部门经理/主管</a>
                                    <a href="/renliziyuan/f05/"  data-value="05">总监/副总裁</a>
                                    <a href="/renliziyuan/f06/"  data-value="06">总裁/总经理</a>
                                  </div>
                                <div class="actions-oper">
                                    <form action="/renliziyuan/" method="get" id="frmJoblevel">
                                        <input type="hidden" name="v" id="hddJoblevel" class="many-hidden" type-value="f">
                                        <button class="button_a button_a_red" id="btnSubmitJoblevel" data-type="submit" type="submit">确定</button>
                                        <button class="button_a resetbtn" type="button" id="btnResetJoblevel" data-type="remove">清除</button>
                                        <button class="button_a cancelbtn" type="button" id="btnCancelJoblevel" data-type="cancel">取消</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        -->
						<div class="filter_menu">
							<a class="sub_filter <!--{if $query['ComSize']}-->dft_checked cur<!--{/if}-->" href="javascript:">公司规模<i class="jpFntWes n">&#xf107;</i><i class="jpFntWes c">&#xf106;</i><s class="hr"></s></a>
							<div class="filter_options">
								<div class="normal_list">
									<!--<a class="mutil" href="javascript:">多选<i class="jpFntWes">&#xf067;</i></a>-->
									<a class=" hide"  href="javascript:void(0);" rel="/{$searchName}/{$comsizeUrl}<!--{if $comsizeUrl}-->/<!--{/if}-->{$keyword}" >不限</a>
									<!--{loop $__comSize $k $l}-->
									<a href="javascript:void(0);" rel="/{$searchName}/s{$k}{$comsizeUrl}/{$keyword}" class="<!--{if $k==$query['ComSize']}-->dft_checked cur<!--{/if}-->" data-value="{$k}">{$l}</a>
									<!--{/loop}-->
								</div>
								<!--
                                <div class="actions-oper">
                                      <form action="/renliziyuan/" method="get" id="frmComsize">
                                        <input type="hidden" name="v" id="hddComsize" class="many-hidden" type-value="h">
                                        <button class="button_a button_a_red" id="btnSubmitComsize" data-type="submit" type="submit">确定</button>
                                        <button class="button_a resetbtn" type="button" id="btnResetComsize" data-type="remove">清除</button>
                                        <button class="button_a cancelbtn" type="button" id="btnCancelComsize" data-type="cancel">取消</button>
                                     </form>
                                </div>
                                -->
							</div>
						</div>
						<div class="filter_menu">
							<a class="sub_filter  <!--{if $query['Degree']}-->dft_checked cur<!--{/if}-->" href="javascript:">学历要求<i class="jpFntWes n">&#xf107;</i><i class="jpFntWes c">&#xf106;</i><s class="hr"></s></a>
							<div class="filter_options">
								<div class="normal_list">
									<!--<a class="mutil" href="javascript:">多选<i class="jpFntWes">&#xf067;</i></a>-->
									<a class=" hide" href="javascript:void(0);" rel="/{$searchName}/{$degreeUrl}<!--{if $degreeUrl}-->/<!--{/if}-->{$keyword}">不限</a>
									<!--{loop $__degree $k $l}-->
									<a href="javascript:void(0);" rel="/{$searchName}/d{$k}{$degreeUrl}/{$keyword}" class="<!--{if $k==$query['Degree']}-->dft_checked cur<!--{/if}-->" data-value="{$k}">{$l}</a>
									<!--{/loop}-->
								</div>
								<!--
                                <div class="actions-oper">
                                     <form action="/renliziyuan/" method="get" id="frmDegree">
                                        <input type="hidden" name="v" id="hddDegree" class="many-hidden" type-value="i">
                                        <button class="button_a button_a_red" id="btnSubmitDegree" data-type="submit" type="submit">确定</button>
                                        <button class="button_a resetbtn" type="button" id="btnResetDegree" data-type="remove">清除</button>
                                        <button class="button_a cancelbtn" type="button" id="btnCancelDegree" data-type="cancel">取消</button>
                                     </form>
                                </div>
                                -->
							</div>
						</div>
						<div class="filter_menu">
							<a class="sub_filter  <!--{if $query['WorkYear']}-->dft_checked cur<!--{/if}-->" href="javascript:">工作经验<i class="jpFntWes n">&#xf107;</i><i class="jpFntWes c">&#xf106;</i><s class="hr"></s></a>
							<div class="filter_options filter_options_right">
								<div class="normal_list">
									<!--
                                    <a class="mutil" href="javascript:">多选<i class="jpFntWes">&#xf067;</i></a>
                                    -->
									<a class=" hide" href="javascript:void(0);" rel="/{$searchName}/{$workyearUrl}<!--{if $workyearUrl}-->/<!--{/if}-->{$keyword}">不限</a>
									<a	href="javascript:void(0);" rel="/{$searchName}/w99{$workyearUrl}/{$keyword}" data-value="99" class="<!--{if $query['WorkYear']==99}-->dft_checked cur<!--{/if}-->">应届毕业生</a>
									<a	href="javascript:void(0);" rel="/{$searchName}/w1{$workyearUrl}/{$keyword}" data-value="1" class="<!--{if $query['WorkYear']==1}-->dft_checked cur<!--{/if}-->">≥1年</a>
									<a	href="javascript:void(0);" rel="/{$searchName}/w2{$workyearUrl}/{$keyword}" data-value="2" class="<!--{if $query['WorkYear']==2}-->dft_checked cur<!--{/if}-->">≥2年</a>
									<a	href="javascript:void(0);" rel="/{$searchName}/w3{$workyearUrl}/{$keyword}" data-value="3" class="<!--{if $query['WorkYear']==3}-->dft_checked cur<!--{/if}-->">≥3年</a>
									<a	href="javascript:void(0);" rel="/{$searchName}/w4{$workyearUrl}/{$keyword}" data-value="4" class="<!--{if $query['WorkYear']==4}-->dft_checked cur<!--{/if}-->">≥4年</a>
									<a	href="javascript:void(0);" rel="/{$searchName}/w5{$workyearUrl}/{$keyword}" data-value="5" class="<!--{if $query['WorkYear']==5}-->dft_checked cur<!--{/if}-->">≥5年</a>
									<a	href="javascript:void(0);" rel="/{$searchName}/w6{$workyearUrl}/{$keyword}" data-value="6" class="<!--{if $query['WorkYear']==6}-->dft_checked cur<!--{/if}-->">≥6年</a>
									<a	href="javascript:void(0);" rel="/{$searchName}/w7{$workyearUrl}/{$keyword}" data-value="7" class="<!--{if $query['WorkYear']==7}-->dft_checked cur<!--{/if}-->">≥7年</a>
									<a	href="javascript:void(0);" rel="/{$searchName}/w8{$workyearUrl}/{$keyword}" data-value="8" class="<!--{if $query['WorkYear']==8}-->dft_checked cur<!--{/if}-->">≥8年</a>
									<a	href="javascript:void(0);" rel="/{$searchName}/w9{$workyearUrl}/{$keyword}" data-value="9" class="<!--{if $query['WorkYear']==9}-->dft_checked cur<!--{/if}-->">≥9年</a>
									<a	href="javascript:void(0);" rel="/{$searchName}/w10{$workyearUrl}/{$keyword}" data-value="10" class="<!--{if $query['WorkYear']==10}-->dft_checked cur<!--{/if}-->">≥10年</a>
								</div>
								<!--
                                <div class="actions-oper">
                                    <form action="/renliziyuan/" method="get" id="frmWorkyear">
                                        <input type="hidden" name="workyearid">
                                        <input type="hidden" name="v" id="hddWorkyear" class="many-hidden" type-value="j">
                                        <button class="button_a button_a_red" id="btnSubmitWorkyear" data-type="submit" type="submit">确定</button>
                                        <button class="button_a resetbtn" type="button" id="btnResetWorkyear" data-type="remove">清除</button>
                                        <button class="button_a cancelbtn" type="button" id="btnCancelWorkyear" data-type="cancel">取消</button>
                                    </form>
                                 </div>
                                 -->
							</div>
						</div>
						<div class="filter_menu">
							<a class="sub_filter  <!--{if $query['Reward']}-->dft_checked cur<!--{/if}-->" href="javascript:">福利待遇<i class="jpFntWes n">&#xf107;</i><i class="jpFntWes c">&#xf106;</i><s class="hr"></s></a>
							<div class="filter_options filter_options_right">
								<div class="normal_list">
									<a class=" hide" href="javascript:void(0);" rel="/{$searchName}/{$rewardUrl}<!--{if $rewardUrl}-->/<!--{/if}-->{$keyword}">不限</a>
									<!--{loop $__reward $k $l}-->
									<a href="javascript:void(0);" rel="/{$searchName}/r{$k}{$rewardUrl}/{$keyword}" class="<!--{if $k==$query['Reward']}-->dft_checked cur<!--{/if}-->" data-value="{$k}">{$l}</a>
									<!--{/loop}-->
								</div>
							</div>
						</div>
						<div class="filter_menu">
							<a class="sub_filter  <!--{if $query['joinType']}-->dft_checked cur<!--{/if}-->" href="javascript:">工作类型<i class="jpFntWes n">&#xf107;</i><i class="jpFntWes c">&#xf106;</i><s class="hr"></s></a>
							<div class="filter_options filter_options_right">
								<div class="normal_list">
									<!--
                                    <a class="mutil" href="javascript:">多选<i class="jpFntWes">&#xf067;</i></a>
                                    -->
									<a class=" hide" href="javascript:void(0);" rel="/{$searchName}/{$joinTypeUrl}<!--{if $joinTypeUrl}-->/<!--{/if}-->{$keyword}">不限</a>
									<!--{loop $__joinType $k $l}-->
									<a href="javascript:void(0);" rel="/{$searchName}/j{$k}{$joinTypeUrl}/{$keyword}" class="<!--{if in_array($k,$joinType)}-->dft_checked cur<!--{/if}-->" data-value="{$k}">{$l}</a>
									<!--{/loop}-->
								</div>
								<!--
                                <div class="actions-oper">
                                    <form action="/renliziyuan/" method="get" id="frmJobtype">
                                        <input type="hidden" name="v" id="hddJobtype" class="many-hidden" type-value="k">
                                        <button class="button_a button_a_red" id="btnSubmitJobtype" data-type="submit" type="submit">确定</button>
                                        <button class="button_a resetbtn" type="button" id="btnResetJobtype" data-type="remove">清除</button>
                                        <button class="button_a cancelbtn" type="button" id="btnCancelJobtype" data-type="cancel">取消</button>
                                    </form>
                                </div>
                                -->
							</div>
						</div>
						<div class="filter_menu">
							<a class="sub_filter <!--{if $query['selUpdateStep']}-->dft_checked cur<!--{/if}-->" href="javascript:">刷新时间<i class="jpFntWes n">&#xf107;</i><i class="jpFntWes c">&#xf106;</i><s class="hr"></s></a>
							<ul class="filter_options price_list filter_options_right">
								<li><a href="javascript:void(0);" rel="/{$searchName}/{$updateStepUrl}<!--{if $updateStepUrl}-->/<!--{/if}-->{$keyword}">不限</a></li>
								<li><a <!--{if $query['selUpdateStep']==1}-->class="dft_checked cur"<!--{/if}--> href="javascript:void(0);" rel="/{$searchName}/u1{$updateStepUrl}/{$keyword}">近一天</a></li>
								<li><a <!--{if $query['selUpdateStep']==3}-->class="dft_checked cur"<!--{/if}--> href="javascript:void(0);" rel="/{$searchName}/u3{$updateStepUrl}/{$keyword}">近三天</a></li>
								<li><a <!--{if $query['selUpdateStep']==7}-->class="dft_checked cur"<!--{/if}--> href="javascript:void(0);" rel="/{$searchName}/u7{$updateStepUrl}/{$keyword}">近七天</a></li>
								<li><a <!--{if $query['selUpdateStep']==30}-->class="dft_checked cur"<!--{/if}--> href="javascript:void(0);" rel="/{$searchName}/u30{$updateStepUrl}/{$keyword}">近三十天</a></li>
							</ul>
						</div>
						<div class="filter_menu">
							<a class="sub_filter <!--{if $query['selGender']}-->dft_checked cur<!--{/if}-->" href="javascript:">性别<i class="jpFntWes n">&#xf107;</i><i class="jpFntWes c">&#xf106;</i><s class="hr"></s></a>
							<ul class="filter_options price_list filter_options_right">
								<li><a href="javascript:void(0);" rel="/{$searchName}/{$genderUrl}<!--{if $genderUrl}-->/<!--{/if}-->{$keyword}">不限</a></li>
								<li><a <!--{if $query['selGender']==1}-->class="dft_checked cur"<!--{/if}--> href="javascript:void(0);" rel="/{$searchName}/x1{$genderUrl}/{$keyword}">男</a></li>
								<li><a <!--{if $query['selGender']==2}-->class="dft_checked cur"<!--{/if}--> href="javascript:void(0);" rel="/{$searchName}/x2{$genderUrl}/{$keyword}">女</a></li>
							</ul>
						</div>
					</div>
				</td>
			</tr>
		</table>
	</div>

	<!-- 职位搜索结果部分 -->
	<div class="job_list_container mgb10">
		<div class="postSearchBg">
			<!-- 搜索结果左半部分 -->
			<div class="postSearchLeft" id="job_list_main">
				<!-- 结果tab页 -->
				<!-- <div class="postSchList">
                    <div class="zList">

                        <a href="/kuaiji/n01_0/" class="cut">刷新时间</a>

                        <a href="/kuaiji/n02_0/" class="">发布时间</a>
                    </div>
                    <a data-urgent-src="/kuaiji/m01/" data-src="/kuaiji/" class="zwPost" href="javascript:void(0)" id="urgentSelect"> <i class=""></i>
                        <img src="/img/company/jobimg.png" width="9" height="16">
                        <span>急聘职位</span>
                    </a>
                </div> -->
				<div class="job_list_tab">
					<ul>
						<li class="current">
							<a href="javascript:;" title="所有职位11111" class="one"></a>
						</li>
						<!--
                        <li>
                            <a href="/kehufuwu/m01/" class="two" title="急聘职位"></a>
                        </li>
                        <li>
                            <a href="/kehufuwu/m03/" class="three" title="名优企业"></a>
                        </li>
                        -->

					</ul>
				</div>
				<div id="job_list" class="job_list_subtab mgb20">
					<span class="tit"> <i></i>
						排序
					</span>
					<ul>
						<li>
							<a href="/{$_city}{$searchName}/o1{$orderUrl}/{$keyword}" <!--{if $query['order']==1}-->class="red"<!--{/if}-->>
							更新时间 <i class="jpIconMoon"></i>
							</a>
						</li>
						<li>
							<!--{if $query['order']==8 || $query['order']==9}-->
							<!--{if $query['order']==8}-->
							<a href="/{$_city}{$searchName}/o9{$orderUrl}/{$keyword}" class="red">
								相关度
								<i class="jpIconMoon"></i>
							</a>
							<!--{/if}-->
							<!--{if $query['order']==9}-->
							<a href="/{$_city}{$searchName}/o8{$orderUrl}/{$keyword}" class="red">
								相关度
								<i class="arrowUp"></i>
							</a>
							<!--{/if}-->
							<!--{else}-->
							<a href="/{$_city}{$searchName}/o8{$orderUrl}/{$keyword}">
								相关度
								<i class="jpIconMoon"></i>
							</a>
							<!--{/if}-->
						</li>
						<li>
							<!--{if $query['order']==6 || $query['order']==7}-->
							<!--{if $query['order']==6}-->
							<a href="/{$_city}{$searchName}/o7{$orderUrl}/{$keyword}" class="red">
								首发时间
								<i class="jpIconMoon"></i>
							</a>
							<!--{/if}-->
							<!--{if $query['order']==7}-->
							<a href="/{$_city}{$searchName}/o6{$orderUrl}/{$keyword}" class="red">
								首发时间
								<i class="arrowUp"></i>
							</a>
							<!--{/if}-->
							<!--{else}-->
							<a href="/{$_city}{$searchName}/o6{$orderUrl}/{$keyword}">
								首发时间
								<i class="jpIconMoon"></i>
							</a>
							<!--{/if}-->
						</li>
						<li>
							<!--{if $query['order']==2 || $query['order']==3}-->
							<!--{if $query['order']==2}-->
							<a href="/{$_city}{$searchName}/o3{$orderUrl}/{$keyword}" class="red">
								薪资
								<i class="jpIconMoon"></i>
							</a>
							<!--{/if}-->
							<!--{if $query['order']==3}-->
							<a href="/{$_city}{$searchName}/o2{$orderUrl}/{$keyword}" class="red">
								薪资
								<i class="arrowUp"></i>
							</a>
							<!--{/if}-->
							<!--{else}-->
							<a href="/{$_city}{$searchName}/o2{$orderUrl}/{$keyword}">
								薪资
								<i class="jpIconMoon"></i>
							</a>
							<!--{/if}-->
						</li>
						<li>
							<!--{if $query['order']==4 || $query['order']==5}-->
							<!--{if $query['order']==4}-->
							<a href="/{$_city}{$searchName}/o5{$orderUrl}/{$keyword}" class="red">
								工龄
								<i class="jpIconMoon"></i>
							</a>
							<!--{/if}-->
							<!--{if $query['order']==5}-->
							<a href="/{$_city}{$searchName}/o4{$orderUrl}/{$keyword}" class="red">
								工龄
								<i class="arrowUp"></i>
							</a>
							<!--{/if}-->
							<!--{else}-->
							<a href="/{$_city}{$searchName}/o4{$orderUrl}/{$keyword}">
								工龄
								<i class="jpIconMoon"></i>
							</a>
							<!--{/if}-->
						</li>
						<li>
							<!--{if $query['order']==10 || $query['order']==11}-->
							<!--{if $query['order']==10}-->
							<a href="/{$_city}{$searchName}/o11{$orderUrl}/{$keyword}" class="red">
								活跃度
								<i class="jpIconMoon"></i>
							</a>
							<!--{/if}-->
							<!--{if $query['order']==11}-->
							<a href="/{$_city}{$searchName}/o10{$orderUrl}/{$keyword}" class="red">
								活跃度
								<i class="arrowUp"></i>
							</a>
							<!--{/if}-->
							<!--{else}-->
							<a href="/{$_city}{$searchName}/o10{$orderUrl}/{$keyword}">
								活跃度
								<i class="jpIconMoon"></i>
							</a>
							<!--{/if}-->
						</li>
						<!--
                        <li>
                            <a href="/{$_city}{$searchName}/o0{$orderUrl}/{$keyword}">
                                聚合排序
                                <i class="jpIconMoon"></i>
                            </a>
                        </li>
                        -->
					</ul>

					<div class="pagebox">
						<label>{$_total}</label>
					</div>

				</div>
				<div class="firm_box" id="firm_box">
					<!--{if !$result['matches']}-->
					<div class="noData mgb10">对不起，没有找到您想要查找的职位</div>
					<!--{else}-->
					<!--循环 firm-item-->
					<div class="firm-filterCompany">
						<div>
							<div class="right">
								提示：添加的隐藏公司信息只在当前浏览器上有效。&nbsp;&nbsp;&nbsp;&nbsp;<a class="firm-clearAll " style="margin-right: 100px;cursor: pointer;">清空隐藏公司列表</a>
							</div>
							隐藏职位的公司：
						</div>
					</div>

					<div class="firm-item fb" style="padding:10px 0 5px;color:#333;background:#f8f8f8;">
						<ul class="firm-list2">
							<li class="firm-l " style="text-indent:30px;">职位名称</li>
							<li class="firm-md">公司名称</li>
							<li >薪资</li>
							<li class="firm-md2">工作地区</li>
							<li class="firm-time" style="color:#444;">更新时间</li>
							<li class="firm-right" style="cursor: auto;">隐藏</li>
						</ul>
						<div class="clear"></div>
					</div>
					<!--{loop $result['matches'] $k $l}-->
					<div class="firm-item">
						<ul class="firm-list2" data-cid="{$l[_cid]}">
							<li class="firm-l">
								<label class="pos check-default ptCheck" data-value="{$l[_jid]}" data-name="pos"></label>
								<a href="{$l[jobUrl]}/job-{$l[_jid]}.html" target="_blank" class="fb des_title" style="" rel="">{$l['jname']}</a>
								<!--{if $l['urgency']==1}--><em class="icons_urgency"></em><!--{/if}-->
							</li>
							<li class="firm-md"><a href="/com-{$l[_cid]}/" target="_blank">{$l['cname']}</a></li>
							<li >{$l['jobSalary']}</li>
							<li class="firm-md2">{$l['jobArea']}</li>
							<li class="firm-time"><!--{if $l['onDay']>0}--><img src="http://cdn.{ROOT_DOMAIN}/images/zwstick.png" title="置顶"/><!--{elseif ($query['order']==6 || $query['order']==7)}-->{$l['createTime']}<!--{else}-->{$l['updateTime']}<!--{/if}--> </li>
							<li class="firm-right">
								<img src="http://cdn.{ROOT_DOMAIN}/images/del.png" alt="隐藏该公司职位,加入隐藏队列" title="隐藏该公司职位,加入隐藏队列">
							</li>
						</ul>
						<div class="clear"></div>
					</div>
					<!-- 职位浮动层 -->

					<!--{/loop}-->
					<!--{/if}-->
					<div class="job_list_table">
						<div class="batch-butn">
							<label for="select-all"><input type="checkbox" class="select-all" id="select-all" />
								全选</label>
							<a class="btn5 btnsF14" id="btnApplyJob" href="javascript:void(0)">
								批量投递职位（
								<span class="batch_num">0</span>
								）
							</a>
							<a class="btn3 btnsF14" id="btnFavJob" href="javascript:void(0)">收藏</a>
						</div>
						<div class="page">
							<!--{$showpage}-->
						</div>
					</div>
				</div>

			</div>
			<div class="clear"></div>
		</div>
	</div>
	<div class="job_sort_list" style="border:1px solid #ddd;padding-top:5px;">
		<div class="header"> <b style="margin-right:10px"><!--{if $domainInfo['region_id']==1}-->597<!--{else}-->{$domainInfo['region_name_short']}<!--{/if}-->人才网招聘频道</b>
			为您提供人才网最新招聘信息；招聘、找工作，就上{$domainInfo['region_name_short']}597人才网；
		</div>
		<dl>
			<dt style="width:98px">热门搜索：</dt>
			<dd>
				<!--{loop $keywordArrAll $k $l}-->
				<!--{if $l['pinyin']}-->
				<a href="/zhaopin/{$l['pinyin']}/" target="_blank">{$l['keyword']}</a>
				<!--{else}-->
				<a href="/zhaopin/?q={$l['keyword']}" target="_blank">{$l['keyword']}</a>
				<!--{/if}-->
				<!--{/loop}-->
			</dd>
		</dl>
	</div>

</div>
<div id="scrollFun" class="scrollFun">
	<div class="scrollFunBox">
		<div class="conR">
			<span class="decPic"></span>
			<span class="decTxt">扫一扫，下载手机版<br>随时看，随时投</span>
		</div>
		<div class="conL">
			<a id="btnApply1" href="javascript:void(0)" class="btn5 btnsF16">批量投递职位（<font class="batch_num">0</font>）</a>
			<a id="btnFav" href="javascript:void(0)" class="btn3 btnsF16">收藏</a>
		</div>
	</div>
	<div class="scrollFunBg"></div>
</div>
<!--{template footer}-->

<div class="bottom-bar" id="listBottomBar" style="display: none;">
	<a href="javascript:;" class="bottom-bar-close"></a>
	<div class="content">
		<span class="bottom-bar-txt">没有找到合适的工作？</span><a href="/person/register.html" target="_blank" class="bottom-bar-btn">1分钟留下信息</a><span class="bottom-bar-txt">我们会将你推荐给优秀企业！坐等好工作来找你！</span>
	</div>
</div>
<img src="http://cdn.{ROOT_DOMAIN}/img/common/loadBox.gif" style="position:fixed;left:50%;top:30%;margin-left:-24px;margin-top:-24px;display:none;" id="loadBox">



</body>
</html>