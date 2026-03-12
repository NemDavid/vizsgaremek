using AdminPanel.SRC.Converters;
using NUnit.Framework;
using System.Globalization;
using System.Windows;

namespace AdminPanel.Tests.Converters;

[TestFixture]
public class BasicConvertersTests
{
    [Test]
    public void BoolToVisibilityConverter_True_ReturnsVisible()
    {
        var converter = new BoolToVisibilityConverter();

        var result = converter.Convert(true, typeof(Visibility), null!, CultureInfo.InvariantCulture);

        Assert.That(result, Is.EqualTo(Visibility.Visible));
    }

    [Test]
    public void BoolToVisibilityConverter_False_ReturnsCollapsed()
    {
        var converter = new BoolToVisibilityConverter();

        var result = converter.Convert(false, typeof(Visibility), null!, CultureInfo.InvariantCulture);

        Assert.That(result, Is.EqualTo(Visibility.Collapsed));
    }

    [Test]
    public void NullImageToVisibilityConverter_Null_ReturnsVisible()
    {
        var converter = new NullImageToVisibilityConverter();

        var result = converter.Convert(null!, typeof(Visibility), null!, CultureInfo.InvariantCulture);

        Assert.That(result, Is.EqualTo(Visibility.Visible));
    }

    [Test]
    public void NullImageToVisibilityConverter_NonNull_ReturnsCollapsed()
    {
        var converter = new NullImageToVisibilityConverter();

        var result = converter.Convert(new object(), typeof(Visibility), null!, CultureInfo.InvariantCulture);

        Assert.That(result, Is.EqualTo(Visibility.Collapsed));
    }

    [Test]
    public void StringToVisibilityConverter_Whitespace_ReturnsCollapsed()
    {
        var converter = new StringToVisibilityConverter();

        var result = converter.Convert("   ", typeof(Visibility), null!, CultureInfo.InvariantCulture);

        Assert.That(result, Is.EqualTo(Visibility.Collapsed));
    }

    [Test]
    public void StringToVisibilityConverter_Text_ReturnsVisible()
    {
        var converter = new StringToVisibilityConverter();

        var result = converter.Convert("hiba", typeof(Visibility), null!, CultureInfo.InvariantCulture);

        Assert.That(result, Is.EqualTo(Visibility.Visible));
    }

    [TestCase(typeof(BoolToVisibilityConverter))]
    [TestCase(typeof(NullImageToVisibilityConverter))]
    [TestCase(typeof(StringToVisibilityConverter))]
    public void ConvertBack_ThrowsNotImplemented(Type converterType)
    {
        dynamic converter = Activator.CreateInstance(converterType)!;

        Assert.Throws<NotImplementedException>(() => converter.ConvertBack(null, typeof(object), null, CultureInfo.InvariantCulture));
    }
}
