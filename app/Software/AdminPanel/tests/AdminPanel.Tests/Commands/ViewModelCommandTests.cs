using AdminPanel.SRC.ViewModel;
using NUnit.Framework;

namespace AdminPanel.Tests.Commands;

[TestFixture]
public class ViewModelCommandTests
{
    [Test]
    public void CanExecute_ReturnsTrue_WhenNoPredicateProvided()
    {
        var command = new ViewModelCommand(_ => { });

        Assert.That(command.CanExecute(null), Is.True);
    }

    [Test]
    public void CanExecute_ReturnsPredicateValue_WhenPredicateProvided()
    {
        var command = new ViewModelCommand(_ => { }, _ => false);

        Assert.That(command.CanExecute(null), Is.False);
    }

    [Test]
    public void Execute_CallsProvidedAction()
    {
        var called = false;
        var command = new ViewModelCommand(_ => called = true);

        command.Execute(null);

        Assert.That(called, Is.True);
    }
}
