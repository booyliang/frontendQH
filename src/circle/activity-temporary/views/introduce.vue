<template>
	<div class="temporary_activity-introduce">
		 <div class="intro_banner"><img src="../assets/intro_banner.png" alt=""></div>

         <div class="intro_content">
			 <h3><span>活动规则</span></h3>
			 <p><i>1</i>每只团队在投票活动中，需上传团队所属学校、团队名称，团队口号，以及一张能够展示团队风采的照片进行参与。</p>
			 <p><i>2</i>参赛团队需用正确的团队名称进行参加（如团队名称过长，可进行简写）。使用错误队名进行参与，则投票无效。</p>
			 <p><i>3</i>线上投票的过程中，一旦出现恶意刷票等作弊行为，将直接取消本次投票成绩，并根据情况决定是否取消本次大赛的参与资格。</p>
         </div>
	</div>
</template>
<style>
    @import '#/css/var.css';
	.temporary_activity-introduce {
		& .intro_banner {
           width: 100%;
           height: 3.36rem;
           overflow: hidden;

           & img {
           	  width: 100%;
           	  height: 100%;
           }
		}

		& .intro_content {
             padding: .5rem .4rem;
             color: var(--text-secondary-color);
		  	 & h3 {
                font-size: .36rem;
                position: relative;
                margin-bottom: .45rem;

                & span {
                	margin-left: .2rem;
                }

                &::before {
                	content: "";
                	position: absolute;
                	width: .08rem;
                	height: .36rem;
                	background: #e6002e;
                	margin-right: .2rem;
                	top: .08rem;
                }
			 } 
			 & p {
                text-align: justify;
			 	font-size: .28rem;
			 	line-height: .45rem;
			 	margin-bottom: .4rem;

			 	& i {
                   display: inline-block;
                   width: .35rem;
                   height: .35rem;
                   background: #f5204a;
                   @apply --circle;
                   color: #fff;
                   line-height: .35rem;
                   text-align: center;
                   margin-right: .15rem;
			 	}
			 	
			 }
		}
	}
</style>
