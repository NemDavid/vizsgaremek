using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Data;
using System.Windows.Media.Imaging;

namespace AdminPanel.SRC.Converters
{
    public class NullOrEmptyToDefaultImageConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            var url = value as string;

            try
            {
                if (!string.IsNullOrWhiteSpace(url))
                    return new BitmapImage(new Uri(url, UriKind.Absolute));
            }
            catch
            {
            }

            return new BitmapImage(new Uri("pack://application:,,,/Images/default-profile.png"));
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
