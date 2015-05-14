<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.util.*,cn.hemw.miniui.*,java.lang.reflect.*"%>
<% 		
	request.setCharacterEncoding("UTF-8");
	response.setCharacterEncoding("UTF-8");	
	 
    String methodName = request.getParameter("method");
    
       
    Class[] argsClass = new Class[2]; 
    argsClass[0] = HttpServletRequest.class;
    argsClass[1] = HttpServletResponse.class;
    
    Class cls = this.getClass();   
    Method method = cls.getMethod(methodName, argsClass);   
    
    Object[] args = new Object[2];
    args[0] = request;
    args[1] = response;   
    method.invoke(this, args);     
   	
%>
<%!
public void SaveData(HttpServletRequest request, HttpServletResponse response) throws Exception
{ 	
    //获取提交的数据
    String submitJSON = request.getParameter("submitData");
    HashMap data = (HashMap)cn.hemw.miniui.JSON.Decode(submitJSON);

    //进行数据处理
    String UserName = data.get("UserName") != null ? data.get("UserName").toString() : "";
    String Pwd =  data.get("Pwd") != null ? data.get("Pwd").toString() : "";
    //......

    //返回处理结果
    String json = cn.hemw.miniui.JSON.Encode(data);
    response.getWriter().write(json);    
}
public void LoadData(HttpServletRequest request, HttpServletResponse response) throws Exception
{
	String path = request.getSession().getServletContext().getRealPath("/");    
	String file = path+"/form.txt";
    String s = cn.hemw.miniui.File.read(file);
    HashMap data = (HashMap)cn.hemw.miniui.JSON.Decode(s);
    
    //返回处理结果
    String json = cn.hemw.miniui.JSON.Encode(data);
    response.getWriter().write(json);    
}
%> 