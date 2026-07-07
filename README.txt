La Taste x 3 Yue 自助餐活动菜单网站

顾客公开链接：
https://la-taste-customer-menu.netlify.app/

备用 GitHub Pages 链接：
https://lunfeiwong-web.github.io/la-taste-customer-menu/

这个网站是纯静态网站，免费托管在 GitHub Pages。
没有数据库、后台、登录系统、付款系统，也不需要复杂框架。

主要文件：
- index.html：网站页面
- styles.css：页面设计
- app.js：读取菜单资料、菜单勾选、打开 WhatsApp 询问
- data/menu-data.json：所有配套、菜单、条款、WhatsApp 号码、图库资料
- assets/images：压缩后的 WebP 图片

以后要改价格、菜单、配套、条款或 WhatsApp 号码：
1. 打开 data/menu-data.json
2. 修改对应文字或号码
3. 保存后重新上传 / 推送到 GitHub Pages

WhatsApp 号码格式：
- contact.mainWhatsApp 使用国际格式，不要加 + 号
- 例子：0124633400 应写成 60124633400

顾客操作方式：
1. 打开公开链接
2. 查看配套和菜单
3. 在菜单项目旁边打勾
4. 填写姓名、日期、人数、配套和备注
5. 按 “Open WhatsApp 打开 WhatsApp”
6. WhatsApp 会自动带出顾客选择的菜单，员工可以直接安排
