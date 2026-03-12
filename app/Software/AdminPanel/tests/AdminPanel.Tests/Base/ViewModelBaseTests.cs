using AdminPanel.SRC.ViewModel;
using NUnit.Framework;

namespace AdminPanel.Tests.Base;

[TestFixture]
public class ViewModelBaseTests
{
    private sealed class TestableViewModel : ViewModelBase
    {
        public void Raise(string propertyName) => OnPropertyChanged(propertyName);
    }

    [Test]
    public void OnPropertyChanged_RaisesPropertyChangedEvent()
    {
        var vm = new TestableViewModel();
        string? changedProperty = null;

        vm.PropertyChanged += (_, e) => changedProperty = e.PropertyName;

        vm.Raise("SampleProperty");

        Assert.That(changedProperty, Is.EqualTo("SampleProperty"));
    }
}
