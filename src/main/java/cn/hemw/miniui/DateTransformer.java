package cn.hemw.miniui;

import flexjson.*;
import flexjson.transformer.*;
import flexjson.ObjectBinder;
import flexjson.JSONException;
import flexjson.ObjectFactory;

import java.text.SimpleDateFormat;
import java.text.ParseException;
import java.lang.reflect.Type;

public class DateTransformer extends AbstractTransformer implements ObjectFactory {

    SimpleDateFormat simpleDateFormatter;

    public DateTransformer(String dateFormat) {
        simpleDateFormatter = new SimpleDateFormat(dateFormat);
    }
   
    public void transform(Object value) {
        getContext().writeQuoted(simpleDateFormatter.format(value));
    }

    public Object instantiate(ObjectBinder context, Object value, Type targetType, Class targetClass) {
        try {        	
            return simpleDateFormatter.parse( value.toString() );            
        } catch (ParseException e) {
            //throw new JSONException(String.format( "Failed to parse %s with %s pattern.", value, simpleDateFormatter.toPattern() ), e );
        	return value;
        }
    }
}
