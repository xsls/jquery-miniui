# jquery-miniui
基于 MiniUI 官方版本 v3.6 进行扩展

# 安装部署说明.txt #
1. 执行 src/main/webapp/dbsql 目录下的 SQL 脚本，创建数据表和初始化测试数据；
2. 使用  Eclipse/MyEclipse 将源代码作为 Maven 工程导入到工作空间；
3. 修改 miniui.properties 中的数据库连接信息（如果需要使用 MSSQLServer，则需要在 pom.xml 的依赖定义中增加对 MSSQLServer JDBC 驱动的依赖）；
4. 将项目部署到 Tomcat 或其他 J2EE 应用服务器中，并启动应用服务器；
5. 在浏览器中访问演示程序。

# 修改/扩展内容 #
- 将演示程序中的 Java 类中加上对泛型的支持，避免编译时出现很多警告信息；
- 演示程序增加对 Oracle 数据库的支持；
- 数据库连接信息从 TestDB.java 中移到 miniui.properties 配置文件中；